import {MODAL_SESSIONS_HISTORY_OPENED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const modalSessionsHistoryOpened = (isOpened: PayloadType): ActionType =>
  createActionWithPayload(MODAL_SESSIONS_HISTORY_OPENED, isOpened);

export default modalSessionsHistoryOpened;
