import {Action} from 'redux';

import {StringDict} from './index';

export interface SimpleAction extends Action {
  type: string;
}

export interface ActionWithPayload<TPayload> extends SimpleAction {
  payload: TPayload;
  type: string;
  [key: string]: any;
}

interface FormSubmitActionPayload {
  formModelPath: string;
  formData: any;
}

export type FormSubmitAction = ActionWithPayload<FormSubmitActionPayload>;
