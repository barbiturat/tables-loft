import {PENDING_REQUEST_TABLE_STOP} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const pendingRequestTableStop = (pending: PayloadType): ActionType =>
  createActionWithPayload(PENDING_REQUEST_TABLE_STOP, pending);

export default pendingRequestTableStop;
