import {REQUESTING_TABLE_STOP_SUCCEEDED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {TableSession} from '../interfaces/backend-models';

type PayloadType = TableSession;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableStopSucceeded = (tableSession: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_TABLE_STOP_SUCCEEDED, tableSession);

export default requestingTableStopSucceeded;
