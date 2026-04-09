<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffSalaryConfig extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'base_salary',
        'allowance',
        'kpi_bonus_rate',
        'effective_from',
        'effective_to',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'base_salary' => 'decimal:0',
            'allowance' => 'decimal:0',
            'kpi_bonus_rate' => 'decimal:2',
            'effective_from' => 'date',
            'effective_to' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the active salary config for a user at a given date.
     */
    public static function activeFor(string $userId, ?string $date = null): ?self
    {
        $date = $date ?? now()->format('Y-m-d');

        return static::where('user_id', $userId)
            ->where('effective_from', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('effective_to')
                  ->orWhere('effective_to', '>=', $date);
            })
            ->orderByDesc('effective_from')
            ->first();
    }
}
