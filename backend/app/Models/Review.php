<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasUuids;

    protected $fillable = [
        'reviewer_id',
        'reviewee_id',
        'review_type',
        'contract_id',
        'rating',
        'comment',
        'would_rehire',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:1',
            'would_rehire' => 'boolean',
        ];
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee()
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }
}
