import { BaseAction } from 'redux-actions';

import { ADMIN_TOKEN_REMOVED } from '../constants/action-names';

const adminTokenRemoved: BaseAction = {
  type: ADMIN_TOKEN_REMOVED
};

export default adminTokenRemoved;
