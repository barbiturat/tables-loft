import {handleAction} from 'redux-actions';

import {PENDING_TABLES} from '../constants/action-names';

export type Structure = boolean;

const isInPending = handleAction<Structure, Structure>(PENDING_TABLES, (state, action) => action.payload, false);

export default isInPending;
