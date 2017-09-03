import { StringDict } from '../interfaces/index';
import { REQUESTING_LOGIN } from '../constants/action-names';
import { FormSubmitAction } from '../interfaces/actions';

const requestingLogin = (formModelPath: string, formData: StringDict): FormSubmitAction => ({
  type: REQUESTING_LOGIN,
  payload: {
    formModelPath,
    formData
  }
});

export default requestingLogin;
