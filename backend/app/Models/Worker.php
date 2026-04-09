<?php

namespace App\Models;

use App\Enums\AssignmentStatus;
use App\Enums\Gender;
use App\Enums\WorkerStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Worker extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'worker_code',
        'user_id',
        'full_name',
        'date_of_birth',
        'gender',
        'id_number',
        'id_issued_date',
        'id_issued_place',
        'id_card_front_url',
        'id_card_back_url',
        'phone',
        'email',
        'zalo',
        'facebook_url',
        'address',
        'district',
        'city',
        'avatar_url',
        'experience_notes',
        'preferred_districts',
        'availability',
        'bank_name',
        'bank_account',
        'bank_account_name',
        'total_orders',
        'total_days_worked',
        'average_rating',
        'no_show_count',
        'last_worked_date',
        'status',
        'blacklist_reason',
        'registered_by',
        'notes',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => WorkerStatus::class,
            'gender' => Gender::class,
            'date_of_birth' => 'date',
            'last_worked_date' => 'date',
            'preferred_districts' => 'array',
            'total_orders' => 'integer',
            'total_days_worked' => 'integer',
            'no_show_count' => 'integer',
            'average_rating' => 'decimal:1',
        ];
    }

    // ── Boot ────────────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (Worker $worker) {
            if (empty($worker->worker_code)) {
                $worker->worker_code = static::generateWorkerCode();
            }
        });
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The user account associated with this worker (optional).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The recruiter who registered this worker.
     */
    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    /**
     * Alias: the staff member assigned to manage this worker.
     */
    public function assignedStaff(): BelongsTo
    {
        return $this->registeredBy();
    }

    /**
     * Skills associated with this worker.
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'worker_skill')
            ->withPivot('level', 'years_experience')
            ->withTimestamps();
    }

    /**
     * All assignments for this worker.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    /**
     * The current active assignment for this worker.
     */
    public function activeAssignment(): HasOne
    {
        return $this->hasOne(Assignment::class)
            ->whereIn('status', [
                AssignmentStatus::Confirmed,
                AssignmentStatus::Working,
            ])
            ->latestOfMany();
    }

    /**
     * Staffing orders this worker has been assigned to (through assignments).
     */
    public function staffingOrders(): BelongsToMany
    {
        return $this->belongsToMany(StaffingOrder::class, 'assignments', 'worker_id', 'order_id')
            ->withPivot(['status', 'assigned_by', 'confirmed_at', 'completed_at'])
            ->withTimestamps();
    }

    /**
     * Attendance records for this worker.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    /**
     * Payroll records for this worker.
     */
    public function payrolls(): HasMany
    {
        return $this->hasMany(PayrollRecord::class);
    }

    /**
     * Ratings received by this worker.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(WorkerRating::class);
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter available workers only.
     */
    public function scopeAvailable(Builder $query): void
    {
        $query->where('status', WorkerStatus::Available);
    }

    /**
     * Scope to filter workers by skill name.
     */
    public function scopeBySkill(Builder $query, string $skillName): void
    {
        $query->whereHas('skills', function (Builder $q) use ($skillName) {
            $q->where('name', $skillName);
        });
    }

    /**
     * Scope to filter workers by area (district or city).
     */
    public function scopeByArea(Builder $query, ?string $district = null, ?string $city = null): void
    {
        if ($district) {
            $query->where(function (Builder $q) use ($district) {
                $q->where('district', $district)
                    ->orWhereJsonContains('preferred_districts', $district);
            });
        }

        if ($city) {
            $query->where('city', $city);
        }
    }

    /**
     * Scope to filter workers by status.
     */
    public function scopeByStatus(Builder $query, WorkerStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Scope for search by name, phone, ID number, or worker code.
     */
    public function scopeSearch(Builder $query, string $term): void
    {
        $query->where(function (Builder $q) use ($term) {
            $q->where('full_name', 'ilike', "%{$term}%")
                ->orWhere('phone', 'ilike', "%{$term}%")
                ->orWhere('id_number', 'ilike', "%{$term}%")
                ->orWhere('worker_code', 'ilike', "%{$term}%");
        });
    }

    // ── Methods ─────────────────────────────────────────────────────

    /**
     * Check if the worker is currently available for assignment.
     */
    public function isAvailable(): bool
    {
        return $this->status === WorkerStatus::Available;
    }

    /**
     * Calculate the average rating from all ratings.
     */
    public function calculateAverageRating(): float
    {
        return round((float) $this->ratings()->avg('overall_score'), 1);
    }

    /**
     * Generate a unique worker code in the format WK-XXXXX.
     */
    public static function generateWorkerCode(): string
    {
        $latestWorker = static::withTrashed()
            ->where('worker_code', 'like', 'WK-%')
            ->orderByDesc('worker_code')
            ->first();

        if ($latestWorker) {
            $lastNumber = (int) substr($latestWorker->worker_code, 3);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return 'WK-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }
}
