import {GLOBAL_ERROR_EXPIRED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

export type ActionType = ActionWithPayload<number>;

const globalErrorExpired = (timestamp: number): ActionType => {
  return createActionWithPayload(GLOBAL_ERROR_EXPIRED, timestamp);
};

export default globalErrorExpired;
