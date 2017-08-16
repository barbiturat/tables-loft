import { createAction } from 'redux-actions';

import { REQUESTING_TABLE_STOP } from '../constants/action-names';

type PayloadType = number;

const requestingTableStop = createAction<PayloadType>(REQUESTING_TABLE_STOP);

export default requestingTableStop;
