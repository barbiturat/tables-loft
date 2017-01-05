import {ActionWithPayload} from '../interfaces/actions';
import {ADMIN_TOKEN_UPDATED, ADMIN_TOKEN_REMOVED} from '../constants/action-names';
import {AdminToken} from '../interfaces/store-models';

export type Structure = AdminToken;

const adminToken = (state: Structure = null, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === ADMIN_TOKEN_UPDATED) {
    return action.payload;
  } else if (action.type === ADMIN_TOKEN_REMOVED) {
    return null;
  } else {
    return state;
  }
};

export default adminToken;
