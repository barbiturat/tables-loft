import {REQUESTING_TABLE_SESSION_CHANGE} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {RequestUpdateTableSessionPayload} from '../interfaces/api-requests';

export type ActionType = ActionWithPayload<RequestUpdateTableSessionPayload>;

const requestingTableSessionChange = (sessionId: number, durationSeconds: number, adminToken: string): ActionType =>
  createActionWithPayload(REQUESTING_TABLE_SESSION_CHANGE, {
    sessionId,
    durationSeconds,
    adminToken
  });

export default requestingTableSessionChange;