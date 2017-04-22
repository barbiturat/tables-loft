import {ActionFunction0, createAction} from 'redux-actions';

import {REQUESTING_TABLE_STOP} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;

const requestingTableStop = createAction<PayloadType>(REQUESTING_TABLE_STOP);

export default requestingTableStop as ActionFunction0<ActionWithPayload<PayloadType>>;
