import {Action, BaseAction} from 'redux-actions';

interface FormSubmitActionPayload {
  readonly formModelPath: string;
  readonly formData: any;
}

export type FormSubmitAction = Action<FormSubmitActionPayload>;
