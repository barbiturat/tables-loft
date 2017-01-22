import {GLOBAL_ERROR_HAPPENED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {GlobalError} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<GlobalError>;

const globalErrorHappened = (message: string): ActionType => {
  const error: GlobalError = {
    message,
    date: Date.now()
  };

  return createActionWithPayload(GLOBAL_ERROR_HAPPENED, error);
};

export default globalErrorHappened;
