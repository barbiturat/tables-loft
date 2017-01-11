import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {MiddlewareAPI} from 'redux';
import {clone, assign} from 'lodash';

import {REQUESTING_TABLE_START} from '../constants/action-names';
import {post, getErrorMessageFromResponse} from '../helpers/requests';
import {ResponseFailedPayload, ResponseStartTablePayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {urlStartTable} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import requestingTableStartFailed from '../action-creators/requesting-table-start-failed';
import {ActionType} from '../action-creators/requesting-table-start';
import pendingRequestTableStatusChange from '../action-creators/pending-request-table-status-change';
import {StoreStructure, Tables} from '../interfaces/store-models';
import tablesChanged from '../action-creators/tables-changed';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import {tableSessionToFront} from '../helpers/api-data-converters/index';

type ResponseOk = AjaxResponseTyped<ResponseStartTablePayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const startTable = ((action$, store: MiddlewareAPI<StoreStructure>) => {
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
                const appData = store.getState().app;
                const currTables = appData.tablesData.tables;
                const newTables: Tables = clone(currTables);
                const currSessions = clone( appData.tableSessionsData.tableSessions );
                const session = (ajaxData as ResponseOk).response.session;
                const convertedSession = tableSessionToFront(session);
                const newSessions = assign({}, currSessions, {
                  [convertedSession.id]: convertedSession
                });
                const pendingStopAction = pendingRequestTableStatusChange(false, tableId);
                const tableSessionsChangedAction = tableSessionsChanged(newSessions);

                const changedTable = newTables[tableId];

                if (changedTable) {
                  changedTable.currentSessionId = convertedSession.id;
                }

                const tablesChangedAction = tablesChanged(newTables);

                return Observable.of<any>(
                  pendingStopAction,
                  tableSessionsChangedAction,
                  tablesChangedAction
                );
              } else {
                const errorMessage = getErrorMessageFromResponse(ajaxData as ResponseError);

                return Observable.of<any>(
                  requestingTableStartFailed(errorMessage)
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
