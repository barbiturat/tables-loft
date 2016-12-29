import {ActionWithPayload} from '../interfaces/actions';
import {USER_EMAIL_CHANGED} from '../constants/action-names';

export type Structure = string;

const email = (state: Structure = '', action: ActionWithPayload<Structure>): Structure => {
  switch (action.type) {
    case USER_EMAIL_CHANGED:
      return action.payload;

    default:
      return state;
  }
};

export default email;
