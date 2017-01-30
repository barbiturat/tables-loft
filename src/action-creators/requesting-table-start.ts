import {REQUESTING_TABLE_START} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableStart = (tableId: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_TABLE_START, tableId);

export default requestingTableStart;
