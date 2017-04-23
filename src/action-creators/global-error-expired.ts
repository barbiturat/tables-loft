import {createAction} from 'redux-actions';

import {GLOBAL_ERROR_EXPIRED} from '../constants/action-names';

type PayloadType = number;

const globalErrorExpired = createAction<PayloadType>(GLOBAL_ERROR_EXPIRED);

export default globalErrorExpired;
