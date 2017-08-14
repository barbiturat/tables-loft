import {combineForms, FieldState, FormState} from 'react-redux-form';

type FieldsOfType<FieldsSet, FieldsType> = {
  [Field in keyof FieldsSet]: FieldsType;
};

interface FormStateWithValue<TValue> extends FormState {
  readonly initialValue: TValue;
  readonly value: TValue;
}

type FormStructure<FormFields> = FieldsOfType<FormFields, FieldState> & {
  readonly $form: FormStateWithValue< FieldsOfType<FormFields, string> >;
};

interface LoginFormFields {
  readonly email: any;
  readonly password?: any;
}

interface ManagerLoginFormFields {
  readonly password?: any;
}

interface FormModels {
  readonly loginForm: FieldsOfType<LoginFormFields, string>;
  readonly managerLoginForm: FieldsOfType<ManagerLoginFormFields, string>;
}

const formsData = combineForms({
  loginForm: {
    email: ''
  },
  managerLoginForm: {
    password: ''
  }
}, 'formsData');

export type LoginForm = FormStructure<LoginFormFields>;
export type ManagerLoginForm = FormStructure<ManagerLoginFormFields>;

export interface Structure extends FormModels {
  readonly forms: {
    readonly loginForm: LoginForm;
    readonly managerLoginForm: ManagerLoginForm;
    readonly $form: FormStateWithValue<FormModels>;
  };
}

export default formsData;

