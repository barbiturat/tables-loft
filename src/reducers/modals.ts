import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import adminLogin, {Structure as AdminLoginStructure} from './admin-login-modal';

export interface Structure {
  adminLogin: AdminLoginStructure;
}

const reducers: ReducersOfType<Structure> = {
  adminLogin
};

const modals = combineReducers<Structure>(reducers);

export default modals;
