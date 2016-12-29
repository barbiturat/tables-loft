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

interface FormModels {
  loginForm: FieldsOfType<LoginFormFields, string>;
}

const formsData = combineForms({
  loginForm: {
    email: ''
  }
}, 'formsData');

export type LoginForm = FormStructure<LoginFormFields>;

export interface Structure extends FormModels {
  forms: {
    loginForm: LoginForm;
    $form: FormStateWithValue<FormModels>;
  };
}

export default formsData;

