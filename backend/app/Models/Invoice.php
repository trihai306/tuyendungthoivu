<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'invoices';

    protected $fillable = [
        'invoice_number',
        'client_id',
        'period_start',
        'period_end',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'total_amount',
        'status',
        'due_date',
        'paid_amount',
        'approved_by',
        'approved_at',
        'sent_at',
        'notes',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => InvoiceStatus::class,
            'period_start' => 'date',
            'period_end' => 'date',
            'due_date' => 'date',
            'approved_at' => 'datetime',
            'sent_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
        ];
    }

    // ── Boot ────────────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (Invoice $invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->invoice_number = static::generateInvoiceNumber();
            }
        });
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The client this invoice is billed to.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Line items on this invoice.
     */
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * Payments received for this invoice (polymorphic).
     */
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    /**
     * The user who approved this invoice.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Alias for approvedBy.
     */
    public function approver(): BelongsTo
    {
        return $this->approvedBy();
    }

    /**
     * The user who created this invoice.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Alias for createdBy.
     */
    public function creator(): BelongsTo
    {
        return $this->createdBy();
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter overdue invoices.
     */
    public function scopeOverdue(Builder $query): void
    {
        $query->whereNotIn('status', [InvoiceStatus::Paid, InvoiceStatus::Cancelled])
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->toDateString());
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus(Builder $query, InvoiceStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Scope to filter by period.
     */
    public function scopeForPeriod(Builder $query, string $from, string $to): void
    {
        $query->where('period_start', '>=', $from)
            ->where('period_end', '<=', $to);
    }

    // ── Methods ─────────────────────────────────────────────────────

    /**
     * Calculate the total from line items (subtotal + tax).
     */
    public function calculateTotal(): float
    {
        $subtotal = (float) $this->items()->sum('amount');
        $taxAmount = $subtotal * ((float) $this->tax_rate / 100);

        return round($subtotal + $taxAmount, 2);
    }

    /**
     * Get the remaining unpaid amount.
     */
    public function remainingAmount(): float
    {
        return max(0, (float) $this->total_amount - (float) $this->paid_amount);
    }

    /**
     * Accessor: get remaining balance.
     */
    public function getRemainingBalanceAttribute(): float
    {
        return $this->remainingAmount();
    }

    /**
     * Check if the invoice is overdue.
     */
    public function isOverdue(): bool
    {
        if (!$this->due_date) {
            return false;
        }

        return $this->due_date->isPast()
            && !in_array($this->status, [InvoiceStatus::Paid, InvoiceStatus::Cancelled]);
    }

    /**
     * Check if the invoice is editable (only in draft status).
     */
    public function isEditable(): bool
    {
        return $this->status === InvoiceStatus::Draft;
    }

    /**
     * Generate a unique invoice number in the format INV-YYYYMM-XXX.
     */
    public static function generateInvoiceNumber(): string
    {
        $prefix = 'INV-' . now()->format('Ym') . '-';

        $lastCode = static::withTrashed()
            ->where('invoice_number', 'like', $prefix . '%')
            ->orderByDesc('invoice_number')
            ->value('invoice_number');

        if ($lastCode) {
            $lastNumber = (int) substr($lastCode, -3);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
