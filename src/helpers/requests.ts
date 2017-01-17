import {Observable, AjaxResponse, AjaxError} from 'rxjs';

import {AjaxErrorTyped, AjaxResponseDefined, Defined} from '../interfaces/index';
import {ResponseFailedPayload} from '../interfaces/api-responses';
import {STATUS_OK} from '../constants/used-http-status-codes';

const handleError = (ajaxErrorData: AjaxError): Observable<AjaxError> => {
  /*if (ajaxErrorData.status === 401) {
    store.dispatch(logOutActionCreator());
  }*/
  return Observable.of(ajaxErrorData);
};

const getExtendedHeaders = (headers = {}): Object => {
  return headers;
};

/*
const prolongSession = (ajaxData: AjaxResponse) => {
  if (isLogged()) {
    savePingTime();
  } else {
    logOut();
  }

  return ajaxData;
};
*/

export const get = (url: string, headers?: Object): Observable<AjaxResponse | AjaxError> => {
  const extendedHeaders = getExtendedHeaders(headers);

  return Observable.ajax.get(url, extendedHeaders)
    // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const post = (url: string, body?: any, headers?: Object): Observable<AjaxResponse | AjaxError> => {
  const extendedHeaders = getExtendedHeaders(headers);

  return Observable.ajax.post(url, body, extendedHeaders)
    // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const request = (method: string, url: string, body?: any, headers?: Object): Observable<AjaxResponse | AjaxError> => {
  const extendedHeaders = getExtendedHeaders(headers);

  return Observable.ajax({
    method,
    url,
    body,
    headers: extendedHeaders
  })
  // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const getErrorMessageFromResponse = (ajaxData?: AjaxErrorTyped<ResponseFailedPayload>) => {
  const defaultErrorMessage = 'Error!';

  return ajaxData && ajaxData.xhr && ajaxData.xhr.response && ajaxData.xhr.response.error ?
    ajaxData.xhr.response.error :
    defaultErrorMessage;
};

export const isAjaxResponseDefined = < TResponseDefined extends AjaxResponseDefined<Defined> >
  (ajaxResponse: any): ajaxResponse is TResponseDefined => {
  return ajaxResponse!.response !== null && ajaxResponse!.status === STATUS_OK;
};

