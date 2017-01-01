import {PENDING_REQUEST_TABLE_STATUS_CHANGE} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = {
  isInPending: boolean;
  tableId: number;
};

export type ActionType = ActionWithPayload<PayloadType>;

const pendingRequestTableStatusChange = (isInPending: boolean, tableId: number): ActionType =>
  createActionWithPayload(PENDING_REQUEST_TABLE_STATUS_CHANGE, {
    isInPending,
    tableId
  });

export default pendingRequestTableStatusChange;