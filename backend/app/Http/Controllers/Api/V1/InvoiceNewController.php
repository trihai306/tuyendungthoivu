<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RecordPaymentRequest;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceNewResource;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceNewController extends Controller
{
    /**
     * List invoices with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['client', 'creator']);

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->input('client_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('period_start', $request->integer('month'))
                ->whereYear('period_start', $request->integer('year'));
        }

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('due_before')) {
            $query->where('due_date', '<=', $request->input('due_before'));
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $records = $query->orderByDesc('created_at')
            ->paginate($perPage);

        return InvoiceNewResource::collection($records)
            ->additional(['message' => 'Danh sách hóa đơn'])
            ->response();
    }

    /**
     * Show invoice detail with items.
     */
    public function show(string $invoiceId): JsonResponse
    {
        $invoice = Invoice::with(['client', 'items.order', 'payments', 'approver', 'creator'])
            ->findOrFail($invoiceId);

        return response()->json([
            'data' => new InvoiceNewResource($invoice),
            'message' => 'Chi tiết hóa đơn.',
        ]);
    }

    /**
     * Create a new invoice with items.
     */
    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $vatRate = $validated['vat_rate'] ?? 10;

        $invoice = DB::transaction(function () use ($validated, $vatRate, $request) {
            $invoiceNumber = Invoice::generateInvoiceNumber();

            // Calculate subtotal from items
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }

            $taxAmount = $subtotal * ($vatRate / 100);
            $totalAmount = $subtotal + $taxAmount;

            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'client_id' => $validated['client_id'],
                'period_start' => $validated['period_start'],
                'period_end' => $validated['period_end'],
                'subtotal' => $subtotal,
                'tax_rate' => $vatRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => InvoiceStatus::Draft,
                'due_date' => $validated['due_date'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()?->id,
            ]);

            // Create line items
            foreach ($validated['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'order_id' => $item['order_id'] ?? null,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'] ?? 'day',
                    'unit_price' => $item['unit_price'],
                    'amount' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return $invoice;
        });

        $invoice->load(['client', 'items.order', 'creator']);

        return response()->json([
            'data' => new InvoiceNewResource($invoice),
            'message' => 'Tạo hóa đơn thành công.',
        ], 201);
    }

    /**
     * Update an invoice (only draft status).
     */
    public function update(UpdateInvoiceRequest $request, string $invoiceId): JsonResponse
    {
        $invoice = Invoice::findOrFail($invoiceId);

        if (!$invoice->isEditable()) {
            return response()->json([
                'message' => 'Chỉ có thể sửa hóa đơn ở trạng thái nháp.',
            ], 422);
        }

        $validated = $request->validated();

        DB::transaction(function () use ($invoice, $validated) {
            // Update invoice fields
            $invoiceData = collect($validated)->except(['items', 'vat_rate'])->toArray();

            if (isset($validated['vat_rate'])) {
                $invoiceData['tax_rate'] = $validated['vat_rate'];
            }

            $invoice->update($invoiceData);

            // Replace items if provided
            if (isset($validated['items'])) {
                $invoice->items()->delete();

                $subtotal = 0;
                foreach ($validated['items'] as $item) {
                    $amount = $item['quantity'] * $item['unit_price'];
                    $subtotal += $amount;

                    InvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'order_id' => $item['order_id'] ?? null,
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'] ?? 'day',
                        'unit_price' => $item['unit_price'],
                        'amount' => $amount,
                    ]);
                }

                $taxRate = $validated['vat_rate'] ?? $invoice->tax_rate;
                $taxAmount = $subtotal * ($taxRate / 100);

                $invoice->update([
                    'subtotal' => $subtotal,
                    'tax_rate' => $taxRate,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $subtotal + $taxAmount,
                ]);
            }
        });

        $invoice->load(['client', 'items.order', 'creator']);

        return response()->json([
            'data' => new InvoiceNewResource($invoice->fresh()),
            'message' => 'Cập nhật hóa đơn thành công.',
        ]);
    }

    /**
     * Delete an invoice (only draft status, soft delete).
     */
    public function destroy(string $invoiceId): JsonResponse
    {
        $invoice = Invoice::findOrFail($invoiceId);

        if (!$invoice->isEditable()) {
            return response()->json([
                'message' => 'Chỉ có thể xóa hóa đơn ở trạng thái nháp.',
            ], 422);
        }

        $invoice->items()->delete();
        $invoice->delete();

        return response()->json([
            'message' => 'Xóa hóa đơn thành công.',
        ], 204);
    }

    /**
     * Send an invoice (draft -> sent).
     */
    public function send(string $invoiceId): JsonResponse
    {
        $invoice = Invoice::findOrFail($invoiceId);

        if ($invoice->status !== InvoiceStatus::Draft) {
            return response()->json([
                'message' => 'Chỉ có thể gửi hóa đơn ở trạng thái nháp.',
            ], 422);
        }

        $invoice->update([
            'status' => InvoiceStatus::Sent,
            'sent_at' => now(),
        ]);

        $invoice->load(['client', 'items', 'creator']);

        return response()->json([
            'data' => new InvoiceNewResource($invoice),
            'message' => 'Gửi hóa đơn thành công.',
        ]);
    }

    /**
     * Record a payment against an invoice.
     */
    public function recordPayment(RecordPaymentRequest $request, string $invoiceId): JsonResponse
    {
        $invoice = Invoice::findOrFail($invoiceId);
        $validated = $request->validated();

        if (in_array($invoice->status, [InvoiceStatus::Draft, InvoiceStatus::Cancelled])) {
            return response()->json([
                'message' => 'Không thể ghi nhận thanh toán cho hóa đơn này.',
            ], 422);
        }

        $remainingBalance = $invoice->remaining_balance;

        if ($validated['amount'] > $remainingBalance) {
            return response()->json([
                'message' => sprintf('Số tiền vượt quá số còn lại (%s).', number_format($remainingBalance)),
            ], 422);
        }

        DB::transaction(function () use ($invoice, $validated, $request) {
            // Create payment record
            Payment::create([
                'payable_type' => 'invoice',
                'payable_id' => $invoice->id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'payment_date' => $validated['payment_date'],
                'reference_number' => $validated['reference_number'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'recorded_by' => $request->user()?->id,
            ]);

            // Update paid amount
            $newPaidAmount = (float) $invoice->paid_amount + (float) $validated['amount'];
            $invoice->update(['paid_amount' => $newPaidAmount]);

            // Update status based on payment
            if ($newPaidAmount >= (float) $invoice->total_amount) {
                $invoice->update(['status' => InvoiceStatus::Paid]);
            } elseif ($newPaidAmount > 0) {
                $invoice->update(['status' => InvoiceStatus::PartiallyPaid]);
            }
        });

        $invoice->load(['client', 'items', 'payments']);

        return response()->json([
            'data' => new InvoiceNewResource($invoice->fresh()),
            'message' => 'Ghi nhận thanh toán thành công.',
        ]);
    }

    /**
     * Duplicate an invoice (create a copy in draft status).
     */
    public function duplicate(string $invoiceId): JsonResponse
    {
        $original = Invoice::with('items')->findOrFail($invoiceId);

        $newInvoice = DB::transaction(function () use ($original) {
            $newInvoice = $original->replicate([
                'invoice_number',
                'status',
                'paid_amount',
                'approved_by',
                'approved_at',
                'sent_at',
            ]);

            $newInvoice->invoice_number = Invoice::generateInvoiceNumber();
            $newInvoice->status = InvoiceStatus::Draft;
            $newInvoice->paid_amount = 0;
            $newInvoice->save();

            // Copy items
            foreach ($original->items as $item) {
                $newItem = $item->replicate(['invoice_id']);
                $newItem->invoice_id = $newInvoice->id;
                $newItem->save();
            }

            return $newInvoice;
        });

        $newInvoice->load(['client', 'items.order', 'creator']);

        return response()->json([
            'data' => new InvoiceNewResource($newInvoice),
            'message' => 'Nhân bản hóa đơn thành công.',
        ], 201);
    }
}
