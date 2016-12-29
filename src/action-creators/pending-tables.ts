import {PENDING_TABLES} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const pendingTables = (pending: PayloadType): ActionType =>
  createActionWithPayload(PENDING_TABLES, pending);

export default pendingTables;
