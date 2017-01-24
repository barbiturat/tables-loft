import {PENDING_BLOCKING_REQUEST} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const pendingBlockingRequest = (pending: PayloadType): ActionType =>
  createActionWithPayload(PENDING_BLOCKING_REQUEST, pending);

export default pendingBlockingRequest;
