import {Action, createAction} from 'redux-actions';

import {ADMIN_TOKEN_UPDATED} from '../constants/action-names';
import {AdminToken} from '../interfaces/store-models';

type PayloadType = AdminToken;

export type ActionType = Action<PayloadType>;

const adminTokenUpdated = createAction<PayloadType>(ADMIN_TOKEN_UPDATED);

export default adminTokenUpdated;
