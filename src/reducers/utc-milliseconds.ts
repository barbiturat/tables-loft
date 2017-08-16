import * as moment from 'moment';
import { handleAction } from 'redux-actions';

import { UTC_MILLISECONDS_UPDATED } from '../constants/action-names';

export type Structure = number;

const utcMilliseconds = handleAction<Structure, Structure>(
  UTC_MILLISECONDS_UPDATED,
  (state, action) => action.payload,
  moment.utc().valueOf()
);

export default utcMilliseconds;
