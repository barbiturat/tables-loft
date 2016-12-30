import {REQUESTING_TABLE_START_SUCCEEDED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {TableSession} from '../interfaces/backend-models';

type PayloadType = TableSession;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableStartSucceeded = (tableSession: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_TABLE_START_SUCCEEDED, tableSession);

export default requestingTableStartSucceeded;
