import {FETCHING_TABLES_FAILED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = string;

export type ActionType = ActionWithPayload<PayloadType>;

const fetchingTablesFailed = (errorMessage: PayloadType): ActionType =>
  createActionWithPayload(FETCHING_TABLES_FAILED, errorMessage);

export default fetchingTablesFailed;
