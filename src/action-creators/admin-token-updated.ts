import {ADMIN_TOKEN_UPDATED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {AdminToken} from '../interfaces/store-models';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = AdminToken;

export type ActionType = ActionWithPayload<PayloadType>;

const adminTokenUpdated = (token: PayloadType): ActionType =>
  createActionWithPayload(ADMIN_TOKEN_UPDATED, token);

export default adminTokenUpdated;
