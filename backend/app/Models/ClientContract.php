<?php

namespace App\Models;

use App\Enums\ContractStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientContract extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'client_id',
        'contract_number',
        'type',
        'start_date',
        'end_date',
        'markup_percentage',
        'payment_terms',
        'value',
        'status',
        'file_url',
        'notes',
        'approved_by',
        'approved_at',
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
            'status' => ContractStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
            'markup_percentage' => 'decimal:2',
            'payment_terms' => 'integer',
            'value' => 'decimal:2',
            'approved_at' => 'datetime',
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The client this contract belongs to.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Staffing orders under this contract.
     */
    public function staffingOrders(): HasMany
    {
        return $this->hasMany(StaffingOrder::class, 'contract_id');
    }

    /**
     * The user who approved this contract.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * The user who created this contract.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter active contracts only.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', ContractStatus::Active);
    }

    /**
     * Scope to filter contracts that are currently valid (date range).
     */
    public function scopeCurrentlyValid(Builder $query): void
    {
        $today = now()->toDateString();
        $query->where('status', ContractStatus::Active)
            ->where('start_date', '<=', $today)
            ->where(function (Builder $q) use ($today) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            });
    }
}
