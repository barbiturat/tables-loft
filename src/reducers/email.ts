import { handleAction } from 'redux-actions';

import { USER_EMAIL_CHANGED } from '../constants/action-names';

export type Structure = string;

const email = handleAction<Structure, Structure>(
  USER_EMAIL_CHANGED,
  (state, action) => action.payload,
  ''
);

export default email;
