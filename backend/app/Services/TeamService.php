<?php

namespace App\Services;

use App\Models\Team;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TeamService
{
    public function __construct(
        private readonly ActivityLogService $activityLogService
    ) {}

    /**
     * List teams with optional filters.
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = Team::with(['department', 'lead', 'members'])->latest();

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a new team.
     */
    public function create(array $data, ?string $userId = null, ?string $ip = null): Team
    {
        return DB::transaction(function () use ($data, $userId, $ip) {
            $team = Team::create($data);

            // If lead_user_id is provided, add them as a team member with lead role
            if (!empty($data['lead_user_id'])) {
                $team->members()->attach($data['lead_user_id'], [
                    'role_in_team' => 'lead',
                    'joined_at' => now(),
                ]);
            }

            $this->activityLogService->log(
                userId: $userId,
                action: 'created',
                description: "Created team: {$team->name}",
                loggable: $team,
                ipAddress: $ip,
            );

            return $team->load(['department', 'lead', 'members']);
        });
    }

    /**
     * Update a team.
     */
    public function update(Team $team, array $data, ?string $userId = null, ?string $ip = null): Team
    {
        return DB::transaction(function () use ($team, $data, $userId, $ip) {
            $team->update($data);

            $this->activityLogService->log(
                userId: $userId,
                action: 'updated',
                description: "Updated team: {$team->name}",
                loggable: $team,
                metadata: ['changes' => $data],
                ipAddress: $ip,
            );

            return $team->load(['department', 'lead', 'members']);
        });
    }

    /**
     * Delete a team.
     */
    public function delete(Team $team, ?string $userId = null, ?string $ip = null): void
    {
        DB::transaction(function () use ($team, $userId, $ip) {
            $this->activityLogService->log(
                userId: $userId,
                action: 'deleted',
                description: "Deleted team: {$team->name}",
                loggable: $team,
                ipAddress: $ip,
            );

            $team->members()->detach();
            $team->delete();
        });
    }

    /**
     * Add a member to a team.
     */
    public function addMember(Team $team, string $userId, string $roleInTeam = 'member', ?string $actorId = null, ?string $ip = null): Team
    {
        return DB::transaction(function () use ($team, $userId, $roleInTeam, $actorId, $ip) {
            // Prevent duplicate membership
            if ($team->members()->where('user_id', $userId)->exists()) {
                // Update role if already a member
                $team->members()->updateExistingPivot($userId, ['role_in_team' => $roleInTeam]);
            } else {
                $team->members()->attach($userId, [
                    'role_in_team' => $roleInTeam,
                    'joined_at' => now(),
                ]);
            }

            $this->activityLogService->log(
                userId: $actorId,
                action: 'added_member',
                description: "Added member to team: {$team->name}",
                loggable: $team,
                metadata: ['user_id' => $userId, 'role_in_team' => $roleInTeam],
                ipAddress: $ip,
            );

            return $team->load(['department', 'lead', 'members']);
        });
    }

    /**
     * Remove a member from a team.
     */
    public function removeMember(Team $team, string $userId, ?string $actorId = null, ?string $ip = null): Team
    {
        return DB::transaction(function () use ($team, $userId, $actorId, $ip) {
            $team->members()->detach($userId);

            $this->activityLogService->log(
                userId: $actorId,
                action: 'removed_member',
                description: "Removed member from team: {$team->name}",
                loggable: $team,
                metadata: ['user_id' => $userId],
                ipAddress: $ip,
            );

            return $team->load(['department', 'lead', 'members']);
        });
    }
}
