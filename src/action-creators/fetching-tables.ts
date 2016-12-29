import {FETCHING_TABLES} from '../constants/action-names';
import {createSimpleAction} from '../helpers/index';

const fetchingTables = createSimpleAction(FETCHING_TABLES);

export default fetchingTables;
