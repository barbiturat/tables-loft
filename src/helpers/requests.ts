import {Observable, AjaxResponse, AjaxError} from 'rxjs';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

const handleError = (ajaxErrorData: AjaxError): Observable<AjaxError> => {
  /*if (ajaxErrorData.status === 401) {
    store.dispatch(logOutActionCreator());
  }*/
  return Observable.of(ajaxErrorData);
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
  return Observable.ajax.get(url)
    // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const post = (url: string, body?: any, headers?: Object): Observable<AjaxResponse | AjaxError> => {
  return Observable.ajax.post(url, body, headers)
    // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};
