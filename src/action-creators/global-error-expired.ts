import {GLOBAL_ERROR_EXPIRED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

export type ActionType = ActionWithPayload<number>;

const globalErrorExpired = (timestamp: number): ActionType => {
  return createActionWithPayload(GLOBAL_ERROR_EXPIRED, timestamp);
};

export default globalErrorExpired;
