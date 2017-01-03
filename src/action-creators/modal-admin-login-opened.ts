import {MODAL_ADMIN_LOGIN_OPENED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const modalAdminLoginOpened = (isOpened: PayloadType): ActionType =>
  createActionWithPayload(MODAL_ADMIN_LOGIN_OPENED, isOpened);

export default modalAdminLoginOpened;
