import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';

import {REQUESTING_TABLE_STOP} from '../constants/action-names';
import {post} from '../helpers/requests';
import {ResponseFailedPayload, ResponseStopTablePayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {urlStopTable} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import pendingRequestTableStatusChange from '../action-creators/pending-request-table-status-change';
import requestingTableStopSucceeded from '../action-creators/requesting-table-stop-succeeded';
import {ActionType} from '../action-creators/requesting-table-stop';
import requestingTableStopFailed from '../action-creators/requesting-table-stop-failed';

type ResponseOk = AjaxResponseTyped<ResponseStopTablePayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const stopTable = ((action$) => {
  return action$.ofType(REQUESTING_TABLE_STOP)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const pendingStart$ = Observable.of(pendingRequestTableStatusChange(true, tableId));
      const url = urlStopTable.replace(':table_id', String(tableId));
      const request$ = Observable.of(null)
        .mergeMap(() =>
          post(url)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if (ajaxData.status === STATUS_OK) {
                const session = (ajaxData as ResponseOk).response.session;
                const pendingStop = pendingRequestTableStatusChange(false, tableId);
                const tableStopSucceeded = requestingTableStopSucceeded(session);

                return Observable.of<any>(
                  tableStopSucceeded,
                  pendingStop
                );
              } else {
                const ajaxErrorData = (ajaxData as ResponseError);

                return Observable.of<any>(
                  requestingTableStopFailed(ajaxErrorData.xhr.response.error)
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

export default stopTable;
