import {ActionWithPayload} from '../interfaces/actions';
import {MODAL_ADMIN_LOGIN_OPENED} from '../constants/action-names';

export type Structure = boolean;

const adminLoginModal = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === MODAL_ADMIN_LOGIN_OPENED) {
    return action.payload;
  } else {
    return state;
  }
};

export default adminLoginModal;
