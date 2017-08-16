import { handleAction } from 'redux-actions';

import { PENDING_TABLE_SESSIONS } from '../constants/action-names';

export type Structure = boolean;

const isInPending = handleAction<Structure, Structure>(
  PENDING_TABLE_SESSIONS,
  (state, action) => action.payload,
  false
);

export default isInPending;
