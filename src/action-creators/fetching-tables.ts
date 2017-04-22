import {BaseAction} from 'redux-actions';

import {FETCHING_TABLES} from '../constants/action-names';

const fetchingTables: BaseAction = {
  type: FETCHING_TABLES
};

export default fetchingTables;
