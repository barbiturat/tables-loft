import {combineForms, FieldState, FormState} from 'react-redux-form';

type FieldsOfType<FieldsSet, FieldsType> = {
  [Field in keyof FieldsSet]: FieldsType;
};

interface FormStateWithValue<TValue> extends FormState {
  initialValue: TValue;
  value: TValue;
}

type FormStructure<FormFields> = FieldsOfType<FormFields, FieldState> & {
  $form: FormStateWithValue< FieldsOfType<FormFields, string> >;
};

interface LoginFormFields {
  email: any;
  password?: any;
}

interface ManagerLoginFormFields {
  password?: any;
}

interface FormModels {
  loginForm: FieldsOfType<LoginFormFields, string>;
  managerLoginForm: FieldsOfType<ManagerLoginFormFields, string>;
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
  forms: {
    loginForm: LoginForm;
    managerLoginForm: ManagerLoginForm;
    $form: FormStateWithValue<FormModels>;
  };
}

export default formsData;

