import {MODAL_SESSIONS_HISTORY_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload, ModalSessionsHistoryChanged} from '../interfaces/actions';

export type ActionType = ActionWithPayload<ModalSessionsHistoryChanged>;

const modalSessionsHistoryChanged = (isOpened: boolean, tableId?: number): ActionType =>
  createActionWithPayload(MODAL_SESSIONS_HISTORY_CHANGED, {
    isOpened,
    tableId
  });

export default modalSessionsHistoryChanged;
