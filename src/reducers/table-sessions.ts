import {CHANGING_TABLE_SESSIONS} from '../constants/action-names';
import {TableSessions} from '../interfaces/store-models';
import {handleAction} from 'redux-actions';

export type Structure = TableSessions;

const tableSessions = handleAction<Structure, Structure>(CHANGING_TABLE_SESSIONS, (state, action) => ({...action.payload}), {});

export default tableSessions;
