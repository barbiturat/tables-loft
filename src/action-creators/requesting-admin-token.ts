import { StringDict } from '../interfaces/index';
import { REQUESTING_ADMIN_TOKEN } from '../constants/action-names';
import { FormSubmitAction } from '../interfaces/actions';

const requestingManagerLogin = (
  formModelPath: string,
  formData: StringDict
): FormSubmitAction => ({
  type: REQUESTING_ADMIN_TOKEN,
  payload: {
    formModelPath,
    formData
  }
});

export default requestingManagerLogin;
