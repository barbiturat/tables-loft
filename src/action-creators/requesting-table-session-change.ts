import {Action, ActionFunction2, createAction} from 'redux-actions';

import {REQUESTING_TABLE_SESSION_CHANGE} from '../constants/action-names';
import {RequestUpdateTableSessionPayload} from '../interfaces/api-requests';

type PayloadType = RequestUpdateTableSessionPayload;
export type ActionType = Action<PayloadType>;

const requestingTableSessionChange = createAction<PayloadType, number, number>(REQUESTING_TABLE_SESSION_CHANGE, (sessionId: number, durationSeconds: number) => ({
  sessionId,
  durationSeconds
}));

export default requestingTableSessionChange as ActionFunction2<number, number, ActionType>;
