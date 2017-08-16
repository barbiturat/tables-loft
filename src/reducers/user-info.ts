import { combineReducers } from 'redux';

import email, { Structure as EmailStructure } from './email';
import { ReducersOfType } from '../interfaces/index';

export interface Structure {
  readonly email: EmailStructure;
}

const reducers: ReducersOfType<Structure> = {
  email
};

const userInfo = combineReducers<Structure>(reducers);

export default userInfo;
