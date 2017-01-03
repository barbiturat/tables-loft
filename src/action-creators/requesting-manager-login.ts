import {StringDict} from '../interfaces/index';
import {REQUESTING_MANAGER_LOGIN} from '../constants/action-names';
import {FormSubmitAction} from '../interfaces/actions';

const requestingManagerLogin = (formModelPath: string, formData: StringDict): FormSubmitAction => ({
  type: REQUESTING_MANAGER_LOGIN,
  payload: {
    formModelPath,
    formData
  }
});

export default requestingManagerLogin;
