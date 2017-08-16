import { Store } from 'redux';
import { BaseAction } from 'redux-actions';
import { Observable } from 'rxjs';
import { Epic } from 'redux-observable';
import * as moment from 'moment';

import { UPDATING_UTC_MILLISECONDS } from '../constants/action-names';
import utcMillisecondsUpdated from '../action-creators/utc-milliseconds-updated';
import { StoreStructure } from '../interfaces/store-models';
import newDayBegun from '../action-creators/new-day-begun';

const DAY_BEGIN_HOURS = 8;

const updateUtcMilliseconds = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(UPDATING_UTC_MILLISECONDS).mergeMap(() => {
    const lastMs = store.getState().app.utcMilliseconds;
    const lastHours = moment.utc(lastMs).hours();
    const newTime = moment.utc();
    const newHours = newTime.hours();

    const isNewDayBegun =
      lastHours < DAY_BEGIN_HOURS && newHours > DAY_BEGIN_HOURS;

    const utcMillisecondsUpdatedAction = utcMillisecondsUpdated(
      newTime.valueOf()
    );
    const newDayBegunAction = isNewDayBegun ? newDayBegun : null;

    const actions: ReadonlyArray<BaseAction> = <ReadonlyArray<BaseAction>>[
      utcMillisecondsUpdatedAction,
      newDayBegunAction
    ].filter(Boolean);

    return Observable.from<BaseAction>(actions);
  });
}) as Epic<BaseAction, StoreStructure>;

export default updateUtcMilliseconds;
