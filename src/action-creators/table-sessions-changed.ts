import {TABLE_SESSIONS_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {TableSession} from '../interfaces/store-models';

type PayloadType = TableSession[];

export type ActionType = ActionWithPayload<PayloadType>;

const tableSessionsChanged = (tableSessions: PayloadType): ActionType =>
  createActionWithPayload(TABLE_SESSIONS_CHANGED, tableSessions);

export default tableSessionsChanged;
