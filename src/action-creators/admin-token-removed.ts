import {ADMIN_TOKEN_REMOVED} from '../constants/action-names';
import {createSimpleAction} from '../helpers/actions';

const adminTokenRemoved = createSimpleAction(ADMIN_TOKEN_REMOVED);

export default adminTokenRemoved;
