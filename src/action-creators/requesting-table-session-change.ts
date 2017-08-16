import { createAction } from 'redux-actions';

import { REQUESTING_TABLE_SESSION_CHANGE } from '../constants/action-names';
import { RequestUpdateTableSessionPayload } from '../interfaces/api-requests';
import { ActionWithPayload } from '../interfaces/actions';

type PayloadType = RequestUpdateTableSessionPayload;
export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableSessionChange = createAction<
  PayloadType,
  number,
  number
>(
  REQUESTING_TABLE_SESSION_CHANGE,
  (sessionId: number, durationSeconds: number) => ({
    sessionId,
    durationSeconds
  })
);

export default requestingTableSessionChange;
