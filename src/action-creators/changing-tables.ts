import {ActionFunctionAny, createAction} from 'redux-actions';

import {CHANGING_TABLES} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {Tables} from '../interfaces/store-models';

type PayloadType = Tables;

const changingTables = createAction<PayloadType>(CHANGING_TABLES);

export default changingTables as ActionFunctionAny<ActionWithPayload<PayloadType>>;
