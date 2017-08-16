import {createAction} from 'redux-actions';

import {CHANGING_TABLE_FIELDS} from '../constants/action-names';
import {Table} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

type ChangedFields = Partial<Table>;

type PayloadType = {
  readonly changedFields: ChangedFields;
  readonly tableId: number;
};

export type ActionType = ActionWithPayload<PayloadType>;

const changingTableFields = createAction<PayloadType, ChangedFields, number>(CHANGING_TABLE_FIELDS, (changedFields, tableId) => ({
  changedFields,
  tableId
}));

export default changingTableFields;
