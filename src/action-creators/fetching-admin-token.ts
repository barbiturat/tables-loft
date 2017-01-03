import {FETCHING_ADMIN_TOKEN} from '../constants/action-names';
import {createSimpleAction} from '../helpers/index';

const fetchingAdminToken = createSimpleAction(FETCHING_ADMIN_TOKEN);

export default fetchingAdminToken;
