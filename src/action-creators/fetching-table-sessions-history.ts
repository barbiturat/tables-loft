import { createAction } from 'redux-actions';

import { FETCHING_TABLE_SESSIONS_HISTORY } from '../constants/action-names';
import { ActionWithPayload } from '../interfaces/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const fetchingTableSessionsHistory = createAction<PayloadType>(
  FETCHING_TABLE_SESSIONS_HISTORY
);

export default fetchingTableSessionsHistory;
