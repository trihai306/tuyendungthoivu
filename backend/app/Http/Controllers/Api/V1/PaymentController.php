<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\PayrollRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * List payment history with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with(['payable', 'recorder']);

        if ($request->filled('payable_type')) {
            $query->where('payable_type', $request->input('payable_type'));
        }

        if ($request->filled('date_from')) {
            $query->where('payment_date', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->where('payment_date', '<=', $request->input('date_to'));
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->input('payment_method'));
        }

        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('reference_number', 'ilike', "%{$term}%")
                  ->orWhere('notes', 'ilike', "%{$term}%");
            });
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $records = $query->orderByDesc('payment_date')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return PaymentResource::collection($records)
            ->additional(['message' => 'Lich su thanh toan'])
            ->response();
    }

    /**
     * Create a new payment for an invoice or payroll.
     */
    public function store(StorePaymentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Resolve the payable model
        $payable = match ($validated['payable_type']) {
            'invoice' => Invoice::find($validated['payable_id']),
            'payroll' => PayrollRecord::find($validated['payable_id']),
            default => null,
        };

        if (!$payable) {
            return response()->json([
                'message' => 'Doi tuong thanh toan khong ton tai.',
            ], 404);
        }

        $payment = DB::transaction(function () use ($validated, $payable, $request) {
            $payment = Payment::create([
                'payable_type' => $validated['payable_type'],
                'payable_id' => $validated['payable_id'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'payment_date' => $validated['payment_date'],
                'reference_number' => $validated['reference_number'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'recorded_by' => $request->user()?->id,
            ]);

            // Update invoice paid_amount and status if applicable
            if ($validated['payable_type'] === 'invoice' && $payable instanceof Invoice) {
                $newPaid = (float) $payable->paid_amount + (float) $validated['amount'];
                $payable->update(['paid_amount' => $newPaid]);

                if ($newPaid >= (float) $payable->total_amount) {
                    $payable->update(['status' => \App\Enums\InvoiceStatus::Paid]);
                } elseif ($newPaid > 0 && $payable->status !== \App\Enums\InvoiceStatus::Paid) {
                    $payable->update(['status' => \App\Enums\InvoiceStatus::PartiallyPaid]);
                }
            }

            return $payment;
        });

        $payment->load(['payable', 'recorder']);

        return response()->json([
            'data' => new PaymentResource($payment),
            'message' => 'Ghi nhan thanh toan thanh cong.',
        ], 201);
    }
}
