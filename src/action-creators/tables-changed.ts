import {TABLES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {Table} from '../interfaces/store-models';

type PayloadType = Table[];

export type ActionType = ActionWithPayload<PayloadType>;

const tablesChanged = (tables: PayloadType): ActionType =>
  createActionWithPayload(TABLES_CHANGED, tables);

export default tablesChanged;
