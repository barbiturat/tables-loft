import {REQUESTING_TABLE_STOP_FAILED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = string;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableStopFailed = (errorMessage: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_TABLE_STOP_FAILED, errorMessage);

export default requestingTableStopFailed;
