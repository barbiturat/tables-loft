import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {actions, FieldsObject, ValidityObject} from 'react-redux-form';
import {push} from 'redux-router';

import {REQUESTING_LOGIN} from '../constants/action-names';
import {post} from '../helpers/requests';
import {ResponseDefaultPayload, ResponseLoginFailedPayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {RequestLoginPayload} from '../interfaces/api-requests';
import {urlLogin} from '../constants/urls';
import {SimpleAction, FormSubmitAction} from '../interfaces/actions';
import {API_PREFIX} from '../constants/index';

const requestLogin = ((action$) => {
  return action$.ofType(REQUESTING_LOGIN)
    .switchMap((action: FormSubmitAction) => {
      const {formModelPath} = action.payload;
      const dataToSend: RequestLoginPayload = action.payload.formData;

      const formPendingTurnOn$ = Observable.of(actions.setPending(formModelPath, true));
      const loginRequest$ = Observable.of(null)
        .mergeMap(() =>
          post(`${API_PREFIX}${urlLogin}`, dataToSend)
            .mergeMap((ajaxData: AjaxResponseTyped<ResponseDefaultPayload> | AjaxErrorTyped<ResponseLoginFailedPayload>) => {
              if (ajaxData.status === STATUS_OK) {
                const setSubmittedAction = actions.setSubmitted(formModelPath, true);
                const redirectToIndexAction = push({
                  pathname: '/'
                });

                return Observable.of<any>(
                  setSubmittedAction,
                  redirectToIndexAction
                );
              } else {
                const ajaxErrorData = (ajaxData as AjaxErrorTyped<ResponseLoginFailedPayload>);
                const setFormSubmitFailedAction = actions.setSubmitFailed(formModelPath);
                const errors = ajaxErrorData.xhr.response && ajaxErrorData.xhr.response.errors ?
                  ajaxErrorData.xhr.response.errors : null;

                const validityErrors: FieldsObject<ValidityObject> = {
                  email: errors && errors.email || {
                    isRegistered: false
                  },
                  password: errors && errors.password || {
                    isCorrect: false
                  }
                };

                const setFieldsValidityAction = actions.setFieldsValidity(formModelPath, validityErrors);

                return Observable.of(
                  setFormSubmitFailedAction,
                  setFieldsValidityAction
                );
              }
            })
        );

      return Observable.concat(
        formPendingTurnOn$,
        loginRequest$
      );
    });
}) as Epic<SimpleAction>;

export default requestLogin;
