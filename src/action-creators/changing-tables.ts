import {createAction} from 'redux-actions';

import {CHANGING_TABLES} from '../constants/action-names';
import {Tables} from '../interfaces/store-models';

export type PayloadType = Tables;

const changingTables = createAction<PayloadType>(CHANGING_TABLES);

export default changingTables;
