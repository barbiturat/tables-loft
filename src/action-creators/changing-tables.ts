import { createAction } from 'redux-actions';

import { CHANGING_TABLES } from '../constants/action-names';
import { TablesStore } from '../interfaces/store-models';

export type PayloadType = TablesStore;

const changingTables = createAction<PayloadType>(CHANGING_TABLES);

export default changingTables;
