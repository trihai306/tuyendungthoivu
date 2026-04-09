<?php

namespace App\Models;

use App\Enums\KpiCalculationMethod;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KpiConfig extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'description',
        'unit',
        'applicable_roles',
        'calculation_method',
        'auto_source',
        'default_target',
        'weight',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'applicable_roles' => 'array',
            'calculation_method' => KpiCalculationMethod::class,
            'default_target' => 'decimal:2',
            'weight' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function records(): HasMany
    {
        return $this->hasMany(KpiRecord::class);
    }

    public function scopeActive($query)
    {
        $query->where('is_active', true);
    }

    public function scopeForRole($query, string $role)
    {
        $query->whereJsonContains('applicable_roles', $role);
    }
}
