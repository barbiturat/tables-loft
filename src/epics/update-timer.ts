import {Epic} from 'redux-observable';
import * as moment from 'moment';

import {UPDATING_TIMER} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import timerUpdated from '../action-creators/timer-updated';

const updateTimer = ((action$) => {
  return action$.ofType(UPDATING_TIMER)
    .map(() => {
      return timerUpdated(moment.utc().valueOf());
    });
}) as Epic<SimpleAction>;

export default updateTimer;
