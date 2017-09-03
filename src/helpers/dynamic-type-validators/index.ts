import { AjaxResponse } from 'rxjs';
import { pipe } from 'ramda';
import globalErrorHappened from '../../action-creators/global-error-happened';
import store from '../../store/index';
import { GlobalError } from '../../interfaces/store-models';
import { ValidationError } from '../../custom-typings/tcomb-validation';
import { Action } from 'redux-actions';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

type InputFormat = typeof t.interface;

export const validateResponse = (format: InputFormat, ajaxData: AjaxResponse) => {
  const validationRes = t.validate(ajaxData.response, format);

  if (!validationRes.isValid()) {
    console.log('validationRes', validationRes);
    const url = ajaxData.xhr.responseURL;

    pipe<string, string, Action<GlobalError>, void>(
      errUrl => `Invalid response format from ${url}`,
      globalErrorHappened,
      globalErrorAction => {
        store.dispatch(globalErrorAction);
      }
    )(url);

    pipe<ValidationError, string, TypeError, void>(
      firstError => {
        const path = firstError.path.join('/');
        return `URL: ${url}    Path: ${path}    Message: ${firstError.message}`;
      },
      TypeError,
      error => {
        throw error;
      }
    )(validationRes.firstError() as ValidationError);
  }
};
