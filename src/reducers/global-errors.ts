import {GLOBAL_ERROR_HAPPENED, GLOBAL_ERROR_EXPIRED} from '../constants/action-names';
import {GlobalError} from '../interfaces/store-models';
import {Action} from 'redux-actions';

type ActionWithGlobalError = Action<GlobalError>;

export type Structure = ReadonlyArray<GlobalError>;

const isActionWithGlobalError = (action: ActionWithGlobalError | Action<number>): action is ActionWithGlobalError => {
  return typeof (action as ActionWithGlobalError).payload.date !== 'undefined';
};

const globalErrors = (state: Structure = [], action: ActionWithGlobalError | Action<number>): Structure => {
  if ( action.type === GLOBAL_ERROR_HAPPENED && isActionWithGlobalError(action) ) {
    return [...state, action.payload];
  } else if (action.type === GLOBAL_ERROR_EXPIRED && !isActionWithGlobalError(action)) {
    return state.filter((error) => error.date !== action.payload);
  } else {
    return state;
  }
};

export default globalErrors;
