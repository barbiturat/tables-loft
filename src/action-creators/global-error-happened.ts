import { createAction } from 'redux-actions';

import { GLOBAL_ERROR_HAPPENED } from '../constants/action-names';
import { GlobalError } from '../interfaces/store-models';
import { ActionWithPayload } from '../interfaces/actions';

type PayloadType = GlobalError;

export type ActionType = ActionWithPayload<PayloadType>;

const globalErrorHappened = createAction<
  PayloadType,
  string
>(GLOBAL_ERROR_HAPPENED, (message: string) => ({
  message,
  date: Date.now()
}));

export default globalErrorHappened;
