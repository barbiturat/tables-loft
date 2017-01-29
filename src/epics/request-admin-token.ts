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
import {API_URL} from '../constants/index';
import {validateResponse} from '../helpers/dynamic-type-validators/index';
import pendingBlockingRequest from '../action-creators/pending-blocking-request';
import {StoreStructure} from '../interfaces/store-models';
import {STATUS_UNPROCESSABLE_ENTITY} from '../constants/used-http-status-codes';

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
                const clearPasswordInputAction = actions.change(passwordFieldModelPath, '');
                const resetPasswordInputAction = actions.setInitial(passwordFieldModelPath);

                return Observable.of<any>(
                  blockingPendingTurnOffAction,
                  setSubmittedAction,
                  setAdminTokenAction,
                  clearPasswordInputAction,
                  resetPasswordInputAction
                );
              } else {
                const setFormSubmitFailedAction = actions.setSubmitFailed(formModelPath);
                const passwordIsWrong = ajaxData.status === STATUS_UNPROCESSABLE_ENTITY;
                const setFieldsValidityAction = actions.setFieldsValidity(formModelPath, {
                  password: {
                    isCorrect: !passwordIsWrong
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
}) as Epic<SimpleAction, StoreStructure>;

export default requestAdminToken;
