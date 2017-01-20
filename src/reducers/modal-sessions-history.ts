import {clone} from 'ramda';

import {ActionWithPayload} from '../interfaces/actions';
import {MODAL_SESSIONS_HISTORY_CHANGED} from '../constants/action-names';
import {ModalSessionsHistory} from '../interfaces/store-models';

export type Structure = ModalSessionsHistory;

const modalSessionsHistory = (state: Structure = {
  isOpened: false
}, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === MODAL_SESSIONS_HISTORY_CHANGED) {
    return clone(action.payload);
  } else {
    return state;
  }
};

export default modalSessionsHistory;
