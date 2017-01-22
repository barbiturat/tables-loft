import {Observable, AjaxError} from 'rxjs';
import {Epic} from 'redux-observable';

import {FETCHING_TABLES} from '../constants/action-names';
import {get, isAjaxResponseDefined, getRequestFailedAction} from '../helpers/requests';
import {ResponseTablesPayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxResponseDefined} from '../interfaces/index';
import pendingTables from '../action-creators/pending-tables';
import {urlTables} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {tablesToFront, tableSessionsToFront} from '../helpers/api-data-converters/index';
import {TableSession, Table as TableBackend} from '../interfaces/backend-models';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import changingTables from '../action-creators/changing-tables';
import {Tables} from '../interfaces/store-models';
import {API_URL} from '../constants/index';

type ResponseOk = AjaxResponseTyped<ResponseTablesPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseTablesPayload>;

const getTableSessionsFromTables = (tables: TableBackend[]) => {
  return tables.reduce((memo: TableSession[], table) => {
    const {currentSession, lastSession} = table;

    if (currentSession) { memo.push(currentSession); }
    if (lastSession) { memo.push(lastSession); }

    return memo;
  }, []);
};

const fetchTables = ((action$) => {
  return action$.ofType(FETCHING_TABLES)
    .switchMap(() => {
      const tablesPendingStart$ = Observable.of(pendingTables(true));
      const tablesRequest$ = Observable.of(null)
        .mergeMap(() =>
          get(`${API_URL}${urlTables}`)
            .mergeMap((ajaxData: ResponseOk | AjaxError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                const tables = ajaxData.response.tables;
                const tableSessions = getTableSessionsFromTables(tables);
                const convertedTables: Tables = tablesToFront(tables);
                const convertedTableSessions = tableSessionsToFront(tableSessions);

                const setTables = changingTables(convertedTables);
                const setTableSessions = tableSessionsChanged(convertedTableSessions);
                const tablesPendingStop = pendingTables(false);

                return Observable.of<any>(
                  setTables,
                  setTableSessions,
                  tablesPendingStop
                );
              } else {
                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Fetching tables error');

                const tablesPendingStopAction = pendingTables(false);

                return Observable.of<any>(
                  tablesPendingStopAction,
                  fetchFailedAction
                );
              }
            })
        );

      return Observable.concat(
        tablesPendingStart$,
        tablesRequest$
      );
    });
}) as Epic<SimpleAction>;

export default fetchTables;
