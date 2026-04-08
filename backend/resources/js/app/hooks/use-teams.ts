import { createCrudHooks } from "./use-crud";
import {
  teamsApi,
  type CreateTeamRequest,
  type TeamFilter,
  type UpdateTeamRequest,
} from "@/services/teams";
import type { Team } from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const teamHooks = createCrudHooks<Team, CreateTeamRequest, UpdateTeamRequest, TeamFilter>(
  "teams",
  teamsApi,
  {
    messages: {
      createSuccess: "Tao nhom thanh cong!",
      createError: "Khong the tao nhom. Vui long thu lai.",
      updateSuccess: "Cap nhat nhom thanh cong!",
      updateError: "Khong the cap nhat nhom. Vui long thu lai.",
      deleteSuccess: "Da xoa nhom.",
      deleteError: "Khong the xoa nhom. Vui long thu lai.",
    },
  },
);

export const useTeams = teamHooks.useList;
export const useTeam = teamHooks.useDetail;
export const useCreateTeam = teamHooks.useCreate;
export const useUpdateTeam = teamHooks.useUpdate;
export const useDeleteTeam = teamHooks.useDelete;

export { teamHooks };
