import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';

import {REQUESTING_TABLE_START} from '../constants/action-names';
import {post} from '../helpers/requests';
import {ResponseFailedPayload, ResponseStartTablePayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {urlStartTable} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import requestingTableStartSucceeded from '../action-creators/requesting-table-start-succeeded';
import requestingTableStartFailed from '../action-creators/requesting-table-start-failed';
import {ActionType} from '../action-creators/requesting-table-start';
import pendingRequestTableStatusChange from '../action-creators/pending-request-table-status-change';

type ResponseOk = AjaxResponseTyped<ResponseStartTablePayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const startTable = ((action$) => {
  return action$.ofType(REQUESTING_TABLE_START)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const pendingStart$ = Observable.of(pendingRequestTableStatusChange(true, tableId));
      const url = urlStartTable.replace(':table_id', String(tableId));
      const request$ = Observable.of(null)
        .mergeMap(() =>
          post(url)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if (ajaxData.status === STATUS_OK) {
                const session = (ajaxData as ResponseOk).response.session;
                const pendingStop = pendingRequestTableStatusChange(false, tableId);
                const tableStartSucceeded = requestingTableStartSucceeded(session);

                return Observable.of<any>(
                  tableStartSucceeded,
                  pendingStop
                );
              } else {
                const ajaxErrorData = (ajaxData as ResponseError);

                return Observable.of<any>(
                  requestingTableStartFailed(ajaxErrorData.xhr.response.error)
                );
              }
            })
        );

      return Observable.concat(
        pendingStart$,
        request$
      );
    });
}) as Epic<SimpleAction>;

export default startTable;
