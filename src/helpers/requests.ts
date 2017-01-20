import {Observable, AjaxResponse, AjaxError} from 'rxjs';
import * as queryString from 'query-string';
import {pipe} from 'ramda';

import {AjaxErrorTyped, AjaxResponseDefined, Defined} from '../interfaces/index';
import {ResponseFailedPayload} from '../interfaces/api-responses';
import {
  STATUS_OK, STATUS_BAD_REQUEST, STATUS_UNAUTHORIZED,
  STATUS_FORBIDDEN, STATUS_NOT_FOUND, STATUS_REQUEST_TIMEOUT, STATUS_UNPROCESSABLE_ENTITY, STATUS_INTERNAL_SERVER_ERROR,
  STATUS_SERVICE_UNAVAILABLE
} from '../constants/used-http-status-codes';
import {ActionWithPayload} from '../interfaces/actions';
import globalErrorHappened from '../action-creators/global-error-happened';
import {Error} from '../interfaces/store-models';

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

export const isAjaxError = (ajaxData: any): ajaxData is AjaxError => {
  return ajaxData.status !== STATUS_OK;
};

const ajaxStatusMessages = {
  [STATUS_BAD_REQUEST]: 'Bad request',
  [STATUS_UNAUTHORIZED]: 'Unauthorized',
  [STATUS_FORBIDDEN]: 'Forbidden',
  [STATUS_NOT_FOUND]: 'Not found',
  [STATUS_REQUEST_TIMEOUT]: 'Request timeout',
  [STATUS_UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
  [STATUS_INTERNAL_SERVER_ERROR]: 'Internal server error',
  [STATUS_SERVICE_UNAVAILABLE]: 'Service unavailable'
};

export const getMessageFromAjaxErrorStatus = (status: number): string => {
  return ajaxStatusMessages[status] || 'Some strange error';
};

export const getRequestFailedAction = (ajaxErrorStatus: number, messagePrefix: string) => {
  return pipe< number, string, string, ActionWithPayload<Error[]> >(
    (status: number) => getMessageFromAjaxErrorStatus(status),
    (errorFromStatus: string) => `${messagePrefix}: ${errorFromStatus}`,
    globalErrorHappened
  )(ajaxErrorStatus);
};
