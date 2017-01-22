import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {merge, clone} from 'ramda';

import {REQUESTING_TABLE_START} from '../constants/action-names';
import {post, isAjaxResponseDefined, getRequestFailedAction} from '../helpers/requests';
import {ResponseFailedPayload, ResponseStartTablePayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import {urlStartTable} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {ActionType} from '../action-creators/requesting-table-start';
import pendingRequestTableStatusChange from '../action-creators/pending-request-table-status-change';
import {StoreStructure, Tables} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';
import changingTableSessions from '../action-creators/changing-table-sessions';
import {tableSessionToFront} from '../helpers/api-data-converters/index';
import {API_URL} from '../constants/index';

type ResponseOk = AjaxResponseTyped<ResponseStartTablePayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseStartTablePayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const startTable = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(REQUESTING_TABLE_START)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const pendingStart$ = Observable.of(pendingRequestTableStatusChange(true, tableId));
      const url = `${API_URL}${urlStartTable}`.replace(':table_id', String(tableId));
      const request$ = Observable.of(null)
        .mergeMap(() =>
          post(url)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                const appData = store.getState().app;
                const currTables = appData.tablesData.tables;
                const newTables: Tables = clone(currTables);
                const currSessions = clone( appData.tableSessionsData.tableSessions );
                const session = ajaxData.response.session;
                const convertedSession = tableSessionToFront(session);
                const newSessions = merge(currSessions, {
                  [convertedSession.id]: convertedSession
                });
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
                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Table start error: ');

                return Observable.of<any>(
                  fetchFailedAction,
                  pendingStopAction
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
