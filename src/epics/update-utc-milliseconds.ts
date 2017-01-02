import {Epic} from 'redux-observable';
import * as moment from 'moment';

import {UPDATING_UTC_MILLISECONDS} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import utcMillisecondsUpdated from '../action-creators/utc-milliseconds-updated';

const updateUtcMilliseconds = ((action$) => {
  return action$.ofType(UPDATING_UTC_MILLISECONDS)
    .map(() => {
      return utcMillisecondsUpdated(moment.utc().valueOf());
    });
}) as Epic<SimpleAction>;

export default updateUtcMilliseconds;
