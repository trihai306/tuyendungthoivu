<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientContact extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'client_id',
        'name',
        'position',
        'phone',
        'email',
        'is_primary',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The client this contact belongs to.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
