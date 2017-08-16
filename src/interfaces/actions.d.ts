import { Action } from 'redux-actions';

export interface ActionWithPayload<TPayload> extends Action<TPayload> {
  readonly payload: TPayload;
}

interface FormSubmitActionPayload {
  readonly formModelPath: string;
  readonly formData: any;
}

export type FormSubmitAction = ActionWithPayload<FormSubmitActionPayload>;
