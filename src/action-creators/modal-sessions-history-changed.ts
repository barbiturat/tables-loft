import {MODAL_SESSIONS_HISTORY_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {ModalSessionsHistory} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<ModalSessionsHistory>;

const modalSessionsHistoryChanged = (isOpened: boolean, tableId?: number): ActionType =>
  createActionWithPayload(MODAL_SESSIONS_HISTORY_CHANGED, {
    isOpened,
    tableId
  });

export default modalSessionsHistoryChanged;
