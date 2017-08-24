import { createAction } from 'redux-actions';

import { CHANGING_TABLE_FIELDS } from '../constants/action-names';
import { TableStore } from '../interfaces/store-models';
import { ActionWithPayload } from '../interfaces/actions';

type ChangedFields = Partial<TableStore>;

type PayloadType = {
  readonly changedFields: ChangedFields;
  readonly tableId: number;
};

export type ActionType = ActionWithPayload<PayloadType>;

const changingTableFields = createAction<
  PayloadType,
  ChangedFields,
  number
>(CHANGING_TABLE_FIELDS, (changedFields, tableId) => ({
  changedFields,
  tableId
}));

export default changingTableFields;
