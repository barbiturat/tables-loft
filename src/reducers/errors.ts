import {clone} from 'lodash';

import {ERROR_ADDED} from '../constants/action-names';
import {Error} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = Error[];

const globalErrors = (state: Structure = [], action: ActionWithPayload<Error>): Structure => {
  if (action.type === ERROR_ADDED) {
    const errors = clone(state);

    errors.push(action.payload);
    return errors;
  } else {
    return state;
  }
};

export default globalErrors;
