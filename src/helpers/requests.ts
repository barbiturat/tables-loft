import {Observable, AjaxResponse, AjaxError} from 'rxjs';
import * as queryString from 'query-string';

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

export const get = (url: string, dataToSend = {}, headers = {}): Observable<AjaxResponse | AjaxError> => {
  const serializedData = queryString.stringify(dataToSend);
  const extendedHeaders = getExtendedHeaders(headers);
  const newUrl = `${url}?${serializedData}`;

  return Observable.ajax.get(newUrl, extendedHeaders)
  // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const post = (url: string, body?: any, headers = {}): Observable<AjaxResponse | AjaxError> => {
  const extendedHeaders = getExtendedHeaders(headers);

  return Observable.ajax.post(url, body, extendedHeaders)
    // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const request = (method: string, url: string, body?: any, headers = {}): Observable<AjaxResponse | AjaxError> => {
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
  (ajaxResponse: AjaxResponse | AjaxError): ajaxResponse is TResponseDefined => {
  const responseField = (ajaxResponse as any)!.response;

  return responseField !== undefined && responseField !== null && ajaxResponse!.status === STATUS_OK;
};

export const isAjaxError = (ajaxResponse: AjaxResponse | AjaxError): ajaxResponse is AjaxError => {
  return ajaxResponse.status !== STATUS_OK;
};

