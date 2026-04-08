<?php

namespace App\Models;

use App\Enums\ClientStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'company_name',
        'tax_code',
        'industry',
        'company_size',
        'address',
        'district',
        'city',
        'contact_name',
        'contact_phone',
        'contact_email',
        'website',
        'status',
        'notes',
        'logo_path',
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
            'status' => ClientStatus::class,
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * Contacts belonging to this client.
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(ClientContact::class);
    }

    /**
     * Contracts with this client.
     */
    public function contracts(): HasMany
    {
        return $this->hasMany(ClientContract::class);
    }

    /**
     * Staffing orders placed by this client.
     */
    public function staffingOrders(): HasMany
    {
        return $this->hasMany(StaffingOrder::class);
    }

    /**
     * Invoices billed to this client.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * The user (Sales) who created this client record.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter active clients only.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', ClientStatus::Active);
    }

    /**
     * Scope to filter clients by industry.
     */
    public function scopeByIndustry(Builder $query, string $industry): void
    {
        $query->where('industry', $industry);
    }

    /**
     * Scope to filter clients by city.
     */
    public function scopeByCity(Builder $query, string $city): void
    {
        $query->where('city', $city);
    }

    /**
     * Scope to search by company name, contact name, or phone.
     */
    public function scopeSearch(Builder $query, string $term): void
    {
        $query->where(function ($q) use ($term) {
            $q->where('company_name', 'ilike', "%{$term}%")
              ->orWhere('contact_name', 'ilike', "%{$term}%")
              ->orWhere('contact_phone', 'ilike', "%{$term}%");
        });
    }

    // ── Accessors ───────────────────────────────────────────────────

    /**
     * Get the count of active orders for this client.
     */
    public function getActiveOrdersCountAttribute(): int
    {
        return $this->staffingOrders()
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->count();
    }
}
