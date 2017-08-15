import {Action, createAction} from 'redux-actions';

import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';

type PayloadType = number;

export type ActionType = Action<PayloadType>;

const fetchingTableSessionsHistory = createAction<PayloadType>(FETCHING_TABLE_SESSIONS_HISTORY);

export default fetchingTableSessionsHistory;
