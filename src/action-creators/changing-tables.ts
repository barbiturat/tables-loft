import {CHANGING_TABLES} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {Tables} from '../interfaces/store-models';
import {createActionWithPayload} from '../helpers/actions';

export type ActionType = ActionWithPayload<Tables>;

const changingTables = (tables: Tables): ActionType =>
  createActionWithPayload(CHANGING_TABLES, tables);

export default changingTables;
