import {FETCHING_TABLES} from '../constants/action-names';
import {createSimpleAction} from '../helpers/actions';

const fetchingTables = createSimpleAction(FETCHING_TABLES);

export default fetchingTables;
