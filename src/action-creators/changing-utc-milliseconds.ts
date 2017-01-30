import {UPDATING_UTC_MILLISECONDS} from '../constants/action-names';
import {createSimpleAction} from '../helpers/actions';

const changingUtcMilliseconds = createSimpleAction(UPDATING_UTC_MILLISECONDS);

export default changingUtcMilliseconds;
