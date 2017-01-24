import {AjaxResponse} from 'rxjs';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

type InputFormat = typeof t.interface;

export const validateResponse = (format: InputFormat, ajaxData: AjaxResponse) => {
  const validationRes = t.validate(ajaxData.response, format);

  if (!validationRes.isValid()) {
    console.log('validationRes', validationRes);
    const url = ajaxData.xhr.responseURL;
    const firstError = validationRes.firstError();
    const path = firstError.path.join('/');
    const message = `URL: ${url}    Path: ${path}    Message: ${firstError.message}`;

    throw (new TypeError(message));
  }
};
