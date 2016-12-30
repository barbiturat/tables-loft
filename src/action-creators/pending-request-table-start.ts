import {PENDING_REQUEST_TABLE_START} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = {
  isInPending: boolean;
  tableId: number;
};

export type ActionType = ActionWithPayload<PayloadType>;

const pendingRequestTableStart = (isInPending: boolean, tableId: number): ActionType =>
  createActionWithPayload(PENDING_REQUEST_TABLE_START, {
    isInPending,
    tableId
  });

export default pendingRequestTableStart;
