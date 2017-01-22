import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {merge, clone} from 'ramda';

import {REQUESTING_TABLE_STOP} from '../constants/action-names';
import {post, isAjaxResponseDefined, getRequestFailedAction} from '../helpers/requests';
import {ResponseFailedPayload, ResponseStopTablePayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import {urlStopTable} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {ActionType} from '../action-creators/requesting-table-start';
import pendingRequestTableStatusChange from '../action-creators/pending-request-table-status-change';
import {StoreStructure, Tables} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';
import changingTableSessions from '../action-creators/changing-table-sessions';
import {tableSessionToFront} from '../helpers/api-data-converters/index';
import {API_URL} from '../constants/index';

type ResponseOk = AjaxResponseTyped<ResponseStopTablePayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseStopTablePayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const stopTable = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(REQUESTING_TABLE_STOP)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const pendingStart$ = Observable.of(pendingRequestTableStatusChange(true, tableId));
      const url = `${API_URL}${urlStopTable}`.replace(':table_id', String(tableId));
      const request$ = Observable.of(null)
        .mergeMap(() =>
          post(url)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                const appData = store.getState().app;
                const newTables: Tables = clone( appData.tablesData.tables );
                const currSessions = clone( appData.tableSessionsData.tableSessions );
                const session = ajaxData.response.session;
                const convertedSession = tableSessionToFront(session);
                const newSessions = merge({
                  [convertedSession.id]: convertedSession
                }, currSessions);
                const pendingStopAction = pendingRequestTableStatusChange(false, tableId);
                const tableSessionsChangedAction = changingTableSessions(newSessions);

                const changedTable = newTables[tableId];

                if (changedTable) {
                  changedTable.currentSessionId = convertedSession.id;
                }

                const tablesChangedAction = changingTables(newTables);

                return Observable.of<any>(
                  pendingStopAction,
                  tableSessionsChangedAction,
                  tablesChangedAction
                );
              } else {
                const pendingStopAction = pendingRequestTableStatusChange(false, tableId);
                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Table stop error');

                return Observable.of<any>(
                  pendingStopAction,
                  fetchFailedAction
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
