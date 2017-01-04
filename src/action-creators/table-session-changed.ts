import {TABLE_SESSION_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {RequestUpdateTableSessionPayload} from '../interfaces/api-requests';
import {AdminToken} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<RequestUpdateTableSessionPayload>;

const tableSessionChanged = (sessionId: number, durationSeconds: number, adminToken: AdminToken): ActionType =>
  createActionWithPayload(TABLE_SESSION_CHANGED, {
    sessionId,
    durationSeconds,
    adminToken
  });

export default tableSessionChanged;
