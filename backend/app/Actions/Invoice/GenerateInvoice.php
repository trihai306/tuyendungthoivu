<?php

namespace App\Actions\Invoice;

use App\Enums\InvoiceStatus;
use App\Events\InvoiceGenerated;
use App\Models\ActivityLog;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\StaffingOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GenerateInvoice
{
    /**
     * Generate an invoice from a staffing order.
     * Calculates subtotal, VAT, total and creates line items based on order details.
     *
     * @param  array<string, mixed>  $overrides  Optional overrides (tax_rate, due_date, notes, etc.)
     */
    public function execute(
        StaffingOrder $order,
        User $createdBy,
        array $overrides = []
    ): Invoice {
        return DB::transaction(function () use ($order, $createdBy, $overrides) {
            $taxRate = $overrides['tax_rate'] ?? 10.00; // Default 10% VAT
            $dueDate = $overrides['due_date'] ?? now()->addDays(30)->format('Y-m-d');

            // Calculate items from the order
            $items = $this->buildInvoiceItems($order);

            $subtotal = collect($items)->sum('amount');
            $taxAmount = round($subtotal * ($taxRate / 100), 2);
            $totalAmount = $subtotal + $taxAmount;

            // Create the invoice
            $invoice = Invoice::create([
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'client_id' => $order->client_id,
                'period_start' => $order->start_date,
                'period_end' => $order->end_date,
                'subtotal' => $subtotal,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => InvoiceStatus::Draft,
                'due_date' => $dueDate,
                'paid_amount' => 0,
                'notes' => $overrides['notes'] ?? null,
                'created_by' => $createdBy->id,
            ]);

            // Create invoice items
            foreach ($items as $itemData) {
                InvoiceItem::create(array_merge($itemData, [
                    'invoice_id' => $invoice->id,
                ]));
            }

            // Log activity
            ActivityLog::create([
                'user_id' => $createdBy->id,
                'action' => 'invoice.generated',
                'description' => "Generated invoice {$invoice->invoice_number} from order {$order->order_code}",
                'loggable_type' => Invoice::class,
                'loggable_id' => $invoice->id,
                'metadata' => [
                    'invoice_number' => $invoice->invoice_number,
                    'order_code' => $order->order_code,
                    'client_id' => $order->client_id,
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                ],
                'ip_address' => request()?->ip(),
            ]);

            event(new InvoiceGenerated($invoice));

            return $invoice->load('items');
        });
    }

    /**
     * Build invoice line items from a staffing order.
     *
     * @return array<int, array<string, mixed>>
     */
    private function buildInvoiceItems(StaffingOrder $order): array
    {
        $items = [];

        // Get the number of completed/active assignments
        $workerCount = $order->assignments()->active()->count();

        if ($workerCount > 0 && $order->start_date && $order->end_date) {
            $workDays = $order->start_date->diffInWeekdays($order->end_date) + 1;

            // Main staffing service item
            $unitPrice = (float) $order->worker_rate + (float) $order->service_fee;
            $quantity = $workerCount * $workDays;
            $amount = $quantity * $unitPrice;

            $items[] = [
                'order_id' => $order->id,
                'description' => "Staffing service: {$order->position_name} - {$workerCount} workers x {$workDays} days",
                'quantity' => $quantity,
                'unit' => $order->rate_type?->value ?? 'day',
                'unit_price' => $unitPrice,
                'amount' => $amount,
            ];
        }

        return $items;
    }
}
