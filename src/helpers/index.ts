import {SimpleAction} from '../interfaces/actions';

export const isNotEmpty = (val = '') => !!val.length;

export const createSimpleAction = (type: string): SimpleAction => ({
  type
});

export const createActionWithPayload = (type: string, payload: any) => ({
  type,
  payload
});

export const anyTypeGuard = <T>(dataToCheck: any, condition: (data: any) => boolean): dataToCheck is T => {
  return condition(dataToCheck);
};
