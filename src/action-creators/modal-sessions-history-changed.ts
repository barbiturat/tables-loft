import {Action, createAction} from 'redux-actions';

import {MODAL_SESSIONS_HISTORY_CHANGED} from '../constants/action-names';
import {ModalSessionsHistory} from '../interfaces/store-models';

type PayloadType = ModalSessionsHistory;

export type ActionType = Action<ModalSessionsHistory>;

const modalSessionsHistoryChanged = createAction<PayloadType, boolean, number>(MODAL_SESSIONS_HISTORY_CHANGED, (isOpened: boolean, tableId?: number) => ({
  isOpened,
  tableId
}));

export default modalSessionsHistoryChanged as (isOpened: boolean, tableId?: number) => Action<PayloadType>;
