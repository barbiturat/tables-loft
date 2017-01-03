import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import adminLogin, {Structure as AdminLoginStructure} from './modal-admin-login';
import modalSessionsHistory, {Structure as ModalSessionsHistoryStructure} from './modal-sessions-history';

export interface Structure {
  adminLogin: AdminLoginStructure;
  modalSessionsHistory: ModalSessionsHistoryStructure;
}

const reducers: ReducersOfType<Structure> = {
  adminLogin,
  modalSessionsHistory
};

const modals = combineReducers<Structure>(reducers);

export default modals;
