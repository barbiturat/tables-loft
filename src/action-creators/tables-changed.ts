import {TABLES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {Tables} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<Tables>;

const tablesChanged = (tables: Tables): ActionType =>
  createActionWithPayload(TABLES_CHANGED, tables);

export default tablesChanged;
