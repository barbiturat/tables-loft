import {Epic} from 'redux-observable';
import {MiddlewareAPI} from 'redux';

import {UPDATING_TIMER} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {StoreStructure} from '../interfaces/store-models';
import timerUpdated from '../action-creators/timer-updated';

const updateTimer = ((action$, store: MiddlewareAPI<StoreStructure>) => {
  return action$.ofType(UPDATING_TIMER)
    .map(() => {
      const currentTimerValue = store.getState().app.timer;

      return timerUpdated(currentTimerValue + 1);
    });
}) as Epic<SimpleAction>;

export default updateTimer;
