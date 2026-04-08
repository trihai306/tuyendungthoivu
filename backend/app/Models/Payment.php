<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'payable_type',
        'payable_id',
        'amount',
        'payment_method',
        'payment_date',
        'reference_number',
        'notes',
        'recorded_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payment_method' => PaymentMethod::class,
            'payment_date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The payable entity (Invoice or PayrollRecord) - polymorphic.
     */
    public function payable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The user who recorded this payment.
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Alias for recordedBy.
     */
    public function recorder(): BelongsTo
    {
        return $this->recordedBy();
    }
}
