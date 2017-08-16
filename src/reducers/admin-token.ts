import { handleActions } from 'redux-actions';

import { AdminToken } from '../interfaces/store-models';

export type Structure = AdminToken;

const adminToken = handleActions<Structure, Structure>(
  {
    ADMIN_TOKEN_UPDATED: (state, action) => action.payload,
    ADMIN_TOKEN_REMOVED: (state, action) => null
  },
  null
);

export default adminToken;
