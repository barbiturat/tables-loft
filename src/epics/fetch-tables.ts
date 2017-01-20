import {Observable, AjaxError} from 'rxjs';
import {Epic} from 'redux-observable';
import {pipe} from 'ramda';

import {FETCHING_TABLES} from '../constants/action-names';
import {get, isAjaxResponseDefined, getMessageFromAjaxErrorStatus} from '../helpers/requests';
import {ResponseTablesPayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxResponseDefined} from '../interfaces/index';
import pendingTables from '../action-creators/pending-tables';
import {urlTables} from '../constants/urls';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {tablesToFront, tableSessionsToFront} from '../helpers/api-data-converters/index';
import {TableSession, Table as TableBackend} from '../interfaces/backend-models';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import tablesChanged from '../action-creators/tables-changed';
import {Tables, Error} from '../interfaces/store-models';
import {API_URL} from '../constants/index';
import globalErrorHappened from '../action-creators/global-error-happened';

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

                const setTables = tablesChanged(convertedTables);
                const setTableSessions = tableSessionsChanged(convertedTableSessions);
                const tablesPendingStop = pendingTables(false);

                return Observable.of<any>(
                  setTables,
                  setTableSessions,
                  tablesPendingStop
                );
              } else {
                const fetchFailedAction = pipe<number, string, string, ActionWithPayload<Error[]>>(
                  (status: number) => getMessageFromAjaxErrorStatus(status),
                  (errorFromStatus: string) => `Fetching tables error: ${errorFromStatus}`,
                  globalErrorHappened
                )(ajaxData.status);

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
