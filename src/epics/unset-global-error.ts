import { Store } from 'redux';
import { BaseAction } from 'redux-actions';
import { Epic } from 'redux-observable';

import { GLOBAL_ERROR_HAPPENED } from '../constants/action-names';
import { StoreStructure } from '../interfaces/store-models';
import { ActionType } from '../action-creators/global-error-happened';
import globalErrorExpired from '../action-creators/global-error-expired';
// tslint:disable-next-line:no-require-imports
const packageJson = require('../../package.json');

const ERROR_DISPLAY_DURATION =
  packageJson.appSettings.ERROR_DISPLAY_DURATION * 1000;

const unsetGlobalError = ((action$, store: Store<StoreStructure>) => {
  return action$
    .ofType(GLOBAL_ERROR_HAPPENED)
    .delay(ERROR_DISPLAY_DURATION)
    .map((action: ActionType) => {
      const timestamp = action.payload.date;

      return globalErrorExpired(timestamp);
    });
}) as Epic<BaseAction, StoreStructure>;

export default unsetGlobalError;
