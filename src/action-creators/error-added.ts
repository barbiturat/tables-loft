import {ERROR_ADDED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {Error} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<Error[]>;

const errorAdded = (error: Error): ActionType =>
  createActionWithPayload(ERROR_ADDED, error);

export default errorAdded;
