import {PENDING_REQUEST_TABLE_START} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const pendingRequestTableStart = (pending: PayloadType): ActionType =>
  createActionWithPayload(PENDING_REQUEST_TABLE_START, pending);

export default pendingRequestTableStart;
