import {MODAL_SESSIONS_HISTORY_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const modalSessionsHistoryChanged = (isOpened: PayloadType): ActionType =>
  createActionWithPayload(MODAL_SESSIONS_HISTORY_CHANGED, isOpened);

export default modalSessionsHistoryChanged;
