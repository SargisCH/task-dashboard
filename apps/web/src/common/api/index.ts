export * from './client';
export * from './interceptors';
export * from './response-error';

import * as auth from './modules/auth';
import * as users from './modules/users';
import * as tasks from './modules/tasks';

export const api = {
  auth,
  users,
  tasks,
};
