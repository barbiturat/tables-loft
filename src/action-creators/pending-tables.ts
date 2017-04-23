import {createAction} from 'redux-actions';

import {PENDING_TABLES} from '../constants/action-names';

type PayloadType = boolean;

const pendingTables = createAction<PayloadType>(PENDING_TABLES);

export default pendingTables;
