import {REQUESTING_TABLE_STOP} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableStop = (tableId: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_TABLE_STOP, tableId);

export default requestingTableStop;
