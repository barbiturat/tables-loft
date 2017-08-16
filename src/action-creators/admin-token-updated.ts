import {createAction} from 'redux-actions';

import {ADMIN_TOKEN_UPDATED} from '../constants/action-names';
import {AdminToken} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = AdminToken;

export type ActionType = ActionWithPayload<PayloadType>;

const adminTokenUpdated = createAction<PayloadType>(ADMIN_TOKEN_UPDATED);

export default adminTokenUpdated;
