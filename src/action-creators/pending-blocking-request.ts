import {ActionFunctionAny, createAction} from 'redux-actions';

import {PENDING_BLOCKING_REQUEST} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

const pendingBlockingRequest = createAction<PayloadType>(PENDING_BLOCKING_REQUEST);

export default pendingBlockingRequest as ActionFunctionAny<ActionWithPayload<PayloadType>>;
