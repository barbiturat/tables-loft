import {find} from 'lodash';

import {SimpleAction} from '../interfaces/actions';

export const isNotEmpty = (val = '') => !!val.length;

export const createSimpleAction = (type: string): SimpleAction => ({
  type
});

export const createActionWithPayload = (type: string, payload: any) => ({
  type,
  payload
});


export const getElementById = <T extends { id: number }> (array: T[], id?: number) => {
  return find(array, (el: T) => {
    return el.id === id;
  });
};
