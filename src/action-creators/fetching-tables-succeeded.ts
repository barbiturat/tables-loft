import {FETCHING_TABLES_SUCCEEDED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {Table} from '../interfaces/store-models';

type PayloadType = Table[];

export type ActionType = ActionWithPayload<PayloadType>;

const fetchingTablesSucceeded = (tables: PayloadType): ActionType =>
  createActionWithPayload(FETCHING_TABLES_SUCCEEDED, tables);

export default fetchingTablesSucceeded;
