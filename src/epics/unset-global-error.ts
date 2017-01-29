import {Store} from 'redux';
import {Epic} from 'redux-observable';

// tslint:disable-next-line:no-require-imports
const packageJson = require('../../package.json');
import {GLOBAL_ERROR_HAPPENED} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {StoreStructure} from '../interfaces/store-models';
import {ActionType} from '../action-creators/global-error-happened';
import globalErrorExpired from '../action-creators/global-error-expired';

const errorDisplayDuration = packageJson.appSettings.errorDisplayDuration * 1000;

const unsetGlobalError = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(GLOBAL_ERROR_HAPPENED)
    .delay(errorDisplayDuration)
    .map((action: ActionType) => {
      const timestamp = action.payload.date;

      return globalErrorExpired(timestamp);
    });
}) as Epic<SimpleAction, StoreStructure>;

export default unsetGlobalError;
