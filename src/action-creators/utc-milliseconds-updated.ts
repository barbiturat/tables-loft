import { createAction } from 'redux-actions';

import { UTC_MILLISECONDS_UPDATED } from '../constants/action-names';

type PayloadType = number;

const utcMillisecondsUpdated = createAction<PayloadType>(
  UTC_MILLISECONDS_UPDATED
);

export default utcMillisecondsUpdated;
