import {CHANGING_TABLES} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {Table} from '../interfaces/store-models';

type PayloadType = Table[];

export type ActionType = ActionWithPayload<PayloadType>;

const changingTables = (tables: PayloadType): ActionType =>
  createActionWithPayload(CHANGING_TABLES, tables);

export default changingTables;
