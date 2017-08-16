import { createAction } from 'redux-actions';

import { REQUESTING_TABLE_START } from '../constants/action-names';
import { ActionWithPayload } from '../interfaces/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const requestingTableStart = createAction<PayloadType>(REQUESTING_TABLE_START);

export default requestingTableStart;
