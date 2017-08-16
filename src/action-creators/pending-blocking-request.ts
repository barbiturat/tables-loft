import { createAction } from 'redux-actions';

import { PENDING_BLOCKING_REQUEST } from '../constants/action-names';

type PayloadType = boolean;

const pendingBlockingRequest = createAction<PayloadType>(
  PENDING_BLOCKING_REQUEST
);

export default pendingBlockingRequest;
