import {CHANGING_TABLE_FIELDS} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {Table} from '../interfaces/store-models';

type ChangedFields = Partial<Table>;

type PayloadType = {
  changedFields: ChangedFields;
  tableId: number;
};

export type ActionType = ActionWithPayload<PayloadType>;

const changingTableFields = (changedFields: ChangedFields, tableId: number): ActionType =>
  createActionWithPayload(CHANGING_TABLE_FIELDS, {
    changedFields,
    tableId
  });

export default changingTableFields;
