/**
 * @deprecated Use workersApi and employersApi directly.
 * This file exists only for backward compatibility with use-users.ts.
 */
import { workersApi } from "./workers";
import { employersApi } from "./employers";

export const usersApi = {
  getWorkers: workersApi.list,
  getWorker: workersApi.show,
  getEmployers: employersApi.list,
  getEmployer: employersApi.show,
  updateWorkerProfile: workersApi.update,
  updateEmployerProfile: employersApi.update,
};
