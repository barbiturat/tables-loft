import {UPDATING_TIMER} from '../constants/action-names';
import {createSimpleAction} from '../helpers/index';

const changingTimer = createSimpleAction(UPDATING_TIMER);

export default changingTimer;
