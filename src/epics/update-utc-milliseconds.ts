import {Store} from 'redux';
import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import * as moment from 'moment';

import {UPDATING_UTC_MILLISECONDS} from '../constants/action-names';
import utcMillisecondsUpdated from '../action-creators/utc-milliseconds-updated';
import {StoreStructure} from '../interfaces/store-models';
import newDayBegun from '../action-creators/new-day-begun';
import {SimpleAction} from '../interfaces/actions';
import nothingDone from '../action-creators/nothing-done';

const DAY_BEGIN_HOURS = 8;

const updateUtcMilliseconds = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(UPDATING_UTC_MILLISECONDS)
    .mergeMap(() => {
      const lastMs = store.getState().app.utcMilliseconds;
      const lastHours = moment.utc(lastMs).hours();
      const newTime = moment.utc();
      const newHours = newTime.hours();

      const isNewDayBegun = lastHours < DAY_BEGIN_HOURS && newHours > DAY_BEGIN_HOURS;

      const utcMillisecondsUpdatedAction = utcMillisecondsUpdated(newTime.valueOf());
      const newDayBegunAction = isNewDayBegun ? newDayBegun : nothingDone;

      return Observable.of<any>(
        utcMillisecondsUpdatedAction,
        newDayBegunAction
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default updateUtcMilliseconds;
