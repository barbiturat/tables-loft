import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {actions} from 'react-redux-form';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import {REQUESTING_ADMIN_TOKEN} from '../constants/action-names';
import {post, isAjaxResponseDefined} from '../helpers/requests';
import {ResponseGetAdminTokenFailedPayload, ResponseGetAdminTokenPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import {RequestGetAdminTokenPayload} from '../interfaces/api-requests';
import {urlGetAdminToken} from '../constants/urls';
import {SimpleAction, FormSubmitAction} from '../interfaces/actions';
import adminTokenUpdated from '../action-creators/admin-token-updated';
import modalAdminLoginOpened from '../action-creators/modal-admin-login-opened';
import {API_URL} from '../constants/index';
import {validateResponse} from '../helpers/dynamic-type-validators/index';
import pendingBlockingRequest from '../action-creators/pending-blocking-request';

type ResponseOk = AjaxResponseTyped<ResponseGetAdminTokenPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseGetAdminTokenPayload>;
type ResponseError = AjaxErrorTyped<ResponseGetAdminTokenFailedPayload>;

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseGetAdminTokenPayload>t.interface({
    adminToken: t.String
  });

  validateResponse(tResponse, ajaxData);
};

const requestAdminToken = ((action$) => {
  return action$.ofType(REQUESTING_ADMIN_TOKEN)
    .switchMap((action: FormSubmitAction) => {
      const {formModelPath} = action.payload;
      const dataToSend: RequestGetAdminTokenPayload = action.payload.formData;

      const formPendingTurnOn$ = Observable.of(actions.setPending(formModelPath, true));
      const blockingPendingTurnOn$ = Observable.of( pendingBlockingRequest(true) );
      const tokenRequest$ = Observable.of(null)
        .mergeMap(() =>
          post(`${API_URL}${urlGetAdminToken}`, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              const blockingPendingTurnOffAction = pendingBlockingRequest(false);

              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                assertResponse(ajaxData);

                const adminToken = ajaxData.response.adminToken;
                const passwordFieldModelPath = 'formsData.managerLoginForm.password';

                const setSubmittedAction = actions.setSubmitted(formModelPath, true);
                const setAdminTokenAction = adminTokenUpdated(adminToken);
                const closeAdminModalAction = modalAdminLoginOpened(false);
                const clearPasswordInputAction = actions.change(passwordFieldModelPath, '');
                const resetPasswordInputAction = actions.setInitial(passwordFieldModelPath);

                return Observable.of<any>(
                  blockingPendingTurnOffAction,
                  setSubmittedAction,
                  closeAdminModalAction,
                  setAdminTokenAction,
                  clearPasswordInputAction,
                  resetPasswordInputAction
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

                return Observable.of<any>(
                  blockingPendingTurnOffAction,
                  setFormSubmitFailedAction,
                  setFieldsValidityAction
                );
              }
            })
        );

      return Observable.concat(
        blockingPendingTurnOn$,
        formPendingTurnOn$,
        tokenRequest$
      );
    });
}) as Epic<SimpleAction>;

export default requestAdminToken;
