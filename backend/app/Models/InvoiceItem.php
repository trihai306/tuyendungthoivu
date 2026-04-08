<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_id',
        'order_id',
        'description',
        'quantity',
        'unit',
        'unit_price',
        'amount',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:0',
            'amount' => 'decimal:2',
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The invoice this item belongs to.
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * The staffing order this item references.
     */
    public function staffingOrder(): BelongsTo
    {
        return $this->belongsTo(StaffingOrder::class, 'order_id');
    }

    /**
     * Alias for staffingOrder.
     */
    public function order(): BelongsTo
    {
        return $this->staffingOrder();
    }
}
