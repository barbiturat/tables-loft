import {clone} from 'ramda';

import {GLOBAL_ERROR_HAPPENED} from '../constants/action-names';
import {GlobalError} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = GlobalError[];

const globalErrors = (state: Structure = [], action: ActionWithPayload<GlobalError>): Structure => {
  if (action.type === GLOBAL_ERROR_HAPPENED) {
    const errors = clone(state);

    errors.push(action.payload);
    return errors;
  } else {
    return state;
  }
};

export default globalErrors;
