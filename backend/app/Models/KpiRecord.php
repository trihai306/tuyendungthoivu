<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KpiRecord extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'kpi_period_id',
        'user_id',
        'kpi_config_id',
        'target_value',
        'actual_value',
        'score',
        'weight',
        'notes',
        'evaluated_by',
        'evaluated_at',
    ];

    protected function casts(): array
    {
        return [
            'target_value' => 'decimal:2',
            'actual_value' => 'decimal:2',
            'score' => 'decimal:2',
            'weight' => 'decimal:2',
            'evaluated_at' => 'datetime',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(KpiPeriod::class, 'kpi_period_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kpiConfig(): BelongsTo
    {
        return $this->belongsTo(KpiConfig::class);
    }

    public function evaluatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluated_by');
    }

    /**
     * Calculate score based on actual vs target.
     */
    public function calculateScore(): float
    {
        if (!$this->target_value || $this->target_value == 0) {
            return 0;
        }

        $ratio = ((float) $this->actual_value / (float) $this->target_value) * 100;

        return min($ratio, 150); // Cap at 150%
    }
}
