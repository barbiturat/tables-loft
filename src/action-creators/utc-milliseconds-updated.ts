import {UTC_MILLISECONDS_UPDATED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const utcMillisecondsUpdated = (utcMillisecondsValue: PayloadType): ActionType =>
  createActionWithPayload(UTC_MILLISECONDS_UPDATED, utcMillisecondsValue);

export default utcMillisecondsUpdated;
