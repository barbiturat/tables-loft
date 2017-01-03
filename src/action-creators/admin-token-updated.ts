import {ADMIN_TOKEN_UPDATED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {AdminToken} from '../interfaces/store-models';

type PayloadType = AdminToken;

export type ActionType = ActionWithPayload<PayloadType>;

const adminTokenUpdated = (token: PayloadType): ActionType =>
  createActionWithPayload(ADMIN_TOKEN_UPDATED, token);

export default adminTokenUpdated;
