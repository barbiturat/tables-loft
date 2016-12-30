import {REQUESTING_TABLE_START_FAILED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = string;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableStartFailed = (errorMessage: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_TABLE_START_FAILED, errorMessage);

export default requestingTableStartFailed;
