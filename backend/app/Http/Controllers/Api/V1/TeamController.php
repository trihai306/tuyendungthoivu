<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\TeamMemberRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use App\Services\TeamService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function __construct(
        private readonly TeamService $service
    ) {}

    /**
     * List all teams.
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list($request->only(['department_id', 'status', 'search', 'per_page']));
        return TeamResource::collection($result)->response();
    }

    /**
     * Show a single team with members.
     */
    public function show(string $id): JsonResponse
    {
        $team = Team::with(['department', 'lead', 'members'])->findOrFail($id);
        return (new TeamResource($team))->response();
    }

    /**
     * Create a new team.
     */
    public function store(StoreTeamRequest $request): JsonResponse
    {
        $team = $this->service->create(
            data: $request->validated(),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new TeamResource($team))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update a team.
     */
    public function update(UpdateTeamRequest $request, string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        $team = $this->service->update(
            team: $team,
            data: $request->validated(),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new TeamResource($team))->response();
    }

    /**
     * Delete a team.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        $this->service->delete(
            team: $team,
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return response()->json(['message' => 'Xóa nhóm thành công.']);
    }

    /**
     * Add a member to a team.
     */
    public function addMember(TeamMemberRequest $request, string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        $team = $this->service->addMember(
            team: $team,
            userId: $request->validated('user_id'),
            roleInTeam: $request->validated('role_in_team', 'member'),
            actorId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new TeamResource($team))->response();
    }

    /**
     * Remove a member from a team.
     */
    public function removeMember(Request $request, string $id, string $userId): JsonResponse
    {
        $team = Team::findOrFail($id);
        $team = $this->service->removeMember(
            team: $team,
            userId: $userId,
            actorId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new TeamResource($team))->response();
    }
}
