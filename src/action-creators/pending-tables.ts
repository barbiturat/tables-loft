import {ActionFunctionAny, createAction} from 'redux-actions';

import {PENDING_TABLES} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

const pendingTables = createAction<PayloadType>(PENDING_TABLES);

export default pendingTables as ActionFunctionAny<ActionWithPayload<PayloadType>>;
