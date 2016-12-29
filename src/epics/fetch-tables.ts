import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';

import {FETCHING_TABLES} from '../constants/action-names';
import {get} from '../helpers/requests';
import {ResponseTablesPayload, ResponseFailedPayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import pendingTables from '../action-creators/pending-tables';
import fetchingTablesFailed from '../action-creators/fetching-tables-failed';
import {urlTables} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import fetchingTablesSucceeded from '../action-creators/fetching-tables-succeeded';
import {tablesToFront} from '../helpers/api-data-converters/tables';
import {TableSession, Table as TableBackend} from '../interfaces/backend-models';
import tableSessionsChanged from '../action-creators/table-sessions-changed';

type ResponseOk = AjaxResponseTyped<ResponseTablesPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

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
          get(urlTables)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if (ajaxData.status === STATUS_OK) {
                const tables = (ajaxData as ResponseOk).response.tables;
                const tableSessions = getTableSessionsFromTables(tables);
                const convertedTables = tablesToFront(tables);

                const setTables = fetchingTablesSucceeded(convertedTables);
                const setTableSessions = tableSessionsChanged(tableSessions);
                const tablesPendingStop = pendingTables(false);

                return Observable.of<any>(
                  setTables,
                  setTableSessions,
                  tablesPendingStop
                );
              } else {
                const ajaxErrorData = (ajaxData as ResponseError);

                return Observable.of<any>(
                  fetchingTablesFailed(ajaxErrorData.xhr.response.error)
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
