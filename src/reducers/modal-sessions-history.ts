import { handleAction } from 'redux-actions';

import { MODAL_SESSIONS_HISTORY_CHANGED } from '../constants/action-names';
import { ModalSessionsHistory } from '../interfaces/store-models';

export type Structure = ModalSessionsHistory;

const modalSessionsHistory = handleAction<Structure, Structure>(
  MODAL_SESSIONS_HISTORY_CHANGED,
  (state, action) => ({ ...action.payload }),
  {
    isOpened: false
  }
);

export default modalSessionsHistory;
