import { handleAction } from 'redux-actions';

import { PENDING_BLOCKING_REQUEST } from '../constants/action-names';

export type Structure = boolean;

const isBlockingRequestPending = handleAction<Structure, Structure>(
  PENDING_BLOCKING_REQUEST,
  (state, action) => action.payload,
  false
);

export default isBlockingRequestPending;
