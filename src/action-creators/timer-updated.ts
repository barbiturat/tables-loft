import {TIMER_UPDATED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const timerUpdated = (timerValue: PayloadType): ActionType =>
  createActionWithPayload(TIMER_UPDATED, timerValue);

export default timerUpdated;
