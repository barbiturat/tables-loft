import {ActionWithPayload} from '../interfaces/actions';
import {ADMIN_LOGIN_MODAL_OPENED} from '../constants/action-names';

export type Structure = boolean;

const adminLoginModal = (isOpened: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === ADMIN_LOGIN_MODAL_OPENED) {
    return action.payload;
  } else {
    return isOpened;
  }
};

export default adminLoginModal;
