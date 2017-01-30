import {REQUESTING_STATUS_CHANGE} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {TableStatus} from '../interfaces/backend-models';

type PayloadType = TableStatus;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingStatusChange = (status: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_STATUS_CHANGE, status);

export default requestingStatusChange;
