import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import modalSessionsHistory, {Structure as ModalSessionsHistoryStructure} from './modal-sessions-history';

export interface Structure {
  modalSessionsHistory: ModalSessionsHistoryStructure;
}

const reducers: ReducersOfType<Structure> = {
  modalSessionsHistory
};

const modals = combineReducers<Structure>(reducers);

export default modals;
