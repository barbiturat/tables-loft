import {FETCHING_ADMIN_TOKEN} from '../constants/action-names';
import {createSimpleAction} from '../helpers/actions';

const fetchingAdminToken = createSimpleAction(FETCHING_ADMIN_TOKEN);

export default fetchingAdminToken;
