import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {actions} from 'react-redux-form';

import {REQUESTING_ADMIN_TOKEN} from '../constants/action-names';
import {post} from '../helpers/requests';
import {ResponseGetAdminTokenFailedPayload, ResponseGetAdminTokenPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {RequestGetAdminTokenPayload} from '../interfaces/api-requests';
import {urlGetAdminToken} from '../constants/urls';
import {SimpleAction, FormSubmitAction} from '../interfaces/actions';
import adminTokenUpdated from '../action-creators/admin-token-updated';

type ResponseOk = AjaxResponseTyped<ResponseGetAdminTokenPayload>;
type ResponseError = AjaxErrorTyped<ResponseGetAdminTokenFailedPayload>;

const requestAdminToken = ((action$) => {
  return action$.ofType(REQUESTING_ADMIN_TOKEN)
    .switchMap((action: FormSubmitAction) => {
      const {formModelPath} = action.payload;
      const dataToSend: RequestGetAdminTokenPayload = action.payload.formData;

      const formPendingTurnOn$ = Observable.of(actions.setPending(formModelPath, true));
      const tokenRequest$ = Observable.of(null)
        .mergeMap(() =>
          post(urlGetAdminToken, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if (ajaxData.status === STATUS_OK) {
                const accessToken = (ajaxData as ResponseOk).response.accessToken;

                const setSubmittedAction = actions.setSubmitted(formModelPath, true);
                const setAdminTokenAction = adminTokenUpdated(accessToken);

                return Observable.of<any>(
                  setSubmittedAction,
                  setAdminTokenAction
                );
              } else {
                const ajaxErrorData = (ajaxData as ResponseError);
                const setFormSubmitFailedAction = actions.setSubmitFailed(formModelPath);
                const errors = ajaxErrorData.xhr.response && ajaxErrorData.xhr.response.errors ?
                  ajaxErrorData.xhr.response.errors : null;

                const setFieldsValidityAction = actions.setFieldsValidity(formModelPath, {
                  password: errors && errors.password || {
                    isCorrect: false
                  }
                });

                return Observable.of(
                  setFormSubmitFailedAction,
                  setFieldsValidityAction
                );
              }
            })
        );

      return Observable.concat(
        formPendingTurnOn$,
        tokenRequest$
      );
    });
}) as Epic<SimpleAction>;

export default requestAdminToken;
