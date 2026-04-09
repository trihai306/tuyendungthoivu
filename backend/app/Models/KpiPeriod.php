<?php

namespace App\Models;

use App\Enums\KpiPeriodStatus;
use App\Enums\KpiPeriodType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KpiPeriod extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'type',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'type' => KpiPeriodType::class,
            'status' => KpiPeriodStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function records(): HasMany
    {
        return $this->hasMany(KpiRecord::class);
    }

    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeOpen($query)
    {
        $query->where('status', KpiPeriodStatus::Open);
    }
}
