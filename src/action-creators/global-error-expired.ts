import {ActionFunctionAny, createAction} from 'redux-actions';

import {GLOBAL_ERROR_EXPIRED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;
export type ActionType = ActionWithPayload<number>;

const globalErrorExpired = createAction<PayloadType>(GLOBAL_ERROR_EXPIRED);

export default globalErrorExpired as ActionFunctionAny<ActionWithPayload<PayloadType>>;
