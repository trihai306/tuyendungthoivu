import { apiClient } from "./api";
import { createCrudService } from "./base.service";
import type {
  QueryParams,
  SingleResponse,
  Team,
} from "@/types";

export interface CreateTeamRequest {
  name: string;
  department_id: string;
  description?: string;
  lead_id?: string;
  status?: "active" | "inactive";
}

export type UpdateTeamRequest = Partial<CreateTeamRequest>;

export interface TeamFilter extends QueryParams {
  search?: string;
  department_id?: string;
  status?: "active" | "inactive";
}

const crud = createCrudService<Team, CreateTeamRequest, UpdateTeamRequest, TeamFilter>(
  "/teams",
);

export const teamsApi = {
  ...crud,

  /** Add a member to a team */
  addMember: (teamId: string, userId: string) =>
    apiClient
      .post<SingleResponse<Team>>(`/teams/${teamId}/members`, { user_id: userId })
      .then((r) => r.data.data),

  /** Remove a member from a team */
  removeMember: (teamId: string, userId: string) =>
    apiClient
      .delete<{ message: string }>(`/teams/${teamId}/members/${userId}`)
      .then((r) => r.data),
};
