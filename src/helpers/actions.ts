import {BaseAction} from 'redux-actions';

export const createSimpleAction = (type: string): BaseAction => ({
  type
});

export const createActionWithPayload = (type: string, payload: any) => ({
  type,
  payload
});
