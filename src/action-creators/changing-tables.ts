import {CHANGING_TABLES} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {Tables} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<Tables>;

const changingTables = (tables: Tables): ActionType =>
  createActionWithPayload(CHANGING_TABLES, tables);

export default changingTables;
