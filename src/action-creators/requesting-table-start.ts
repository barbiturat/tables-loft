import {Action, createAction} from 'redux-actions';

import {REQUESTING_TABLE_START} from '../constants/action-names';

type PayloadType = number;

export type ActionType = Action<PayloadType>;

const requestingTableStart = createAction<PayloadType>(REQUESTING_TABLE_START);

export default requestingTableStart;
