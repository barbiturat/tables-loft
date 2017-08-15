import {Action, BaseAction} from 'redux-actions';

export interface ActionWithPayload<TPayload> extends BaseAction {
  readonly payload: TPayload;
  readonly type: string;
  readonly [key: string]: any;
}

interface FormSubmitActionPayload {
  readonly formModelPath: string;
  readonly formData: any;
}

export type FormSubmitAction = Action<FormSubmitActionPayload>;
