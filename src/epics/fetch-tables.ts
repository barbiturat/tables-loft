import { Observable, AjaxError } from 'rxjs';
import { Action, BaseAction } from 'redux-actions';
import { Epic } from 'redux-observable';
import { pipe } from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import { FETCHING_TABLES } from '../constants/action-names';
import {
  get,
  isAjaxResponseDefined,
  getRequestFailedAction
} from '../helpers/requests';
import { ResponseTablesPayload } from '../interfaces/api-responses';
import { AjaxResponseTyped, AjaxResponseDefined } from '../interfaces/index';
import pendingTables from '../action-creators/pending-tables';
import { urlTables } from '../constants/urls';
import {
  tablesToFront,
  tableSessionsToFront
} from '../helpers/api-data-converters';
import {
  TableSession,
  Table as TableBackend
} from '../interfaces/backend-models';
import changingTableSessions from '../action-creators/changing-table-sessions';
import changingTables from '../action-creators/changing-tables';
import {
  Tables,
  TableSessions,
  StoreStructure
} from '../interfaces/store-models';
import { API_URL } from '../constants/index';
import { validateResponse } from '../helpers/dynamic-type-validators/index';
import { tTable } from '../helpers/dynamic-type-validators/types';

type ResponseOk = AjaxResponseTyped<ResponseTablesPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseTablesPayload>;

const getTableSessionsFromTables = (tables: ReadonlyArray<TableBackend>) => {
  return tables.reduce((memo: ReadonlyArray<TableSession>, table) => {
    const { currentSession, lastSession } = table;

    if (currentSession) {
      memo = [...memo, currentSession];
    }
    if (lastSession) {
      memo = [...memo, lastSession];
    }

    return memo;
  }, []);
};

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseTablesPayload>t.interface({
    tables: t.list(tTable)
  });

  validateResponse(tResponse, ajaxData);
};

const fetchTables = (action$ => {
  return action$.ofType(FETCHING_TABLES).switchMap(() => {
    const tablesPendingStart$ = Observable.of(pendingTables(true));
    const tablesRequest$ = Observable.of(null).mergeMap(() =>
      get(
        `${API_URL}${urlTables}`
      ).mergeMap((ajaxData: ResponseOk | AjaxError) => {
        if (isAjaxResponseDefined<ResponseOkDefined>(ajaxData)) {
          assertResponse(ajaxData);

          const tables = ajaxData.response.tables;

          const setTableSessions = pipe<
            ReadonlyArray<TableBackend>,
            ReadonlyArray<TableSession>,
            TableSessions,
            Action<TableSessions>
          >(
            getTableSessionsFromTables,
            tableSessionsToFront,
            changingTableSessions
          )(tables);

          const setTables = pipe<
            ReadonlyArray<TableBackend>,
            Tables,
            Action<Tables>
          >(tablesToFront, changingTables)(tables);

          const tablesPendingStop = pendingTables(false);

          return Observable.of<BaseAction>(
            setTables,
            setTableSessions,
            tablesPendingStop
          );
        } else {
          const fetchFailedAction = getRequestFailedAction(
            ajaxData.status,
            'Fetching tables error'
          );
          const tablesPendingStopAction = pendingTables(false);

          return Observable.of<BaseAction>(
            tablesPendingStopAction,
            fetchFailedAction
          );
        }
      })
    );

    return Observable.concat(tablesPendingStart$, tablesRequest$);
  });
}) as Epic<BaseAction, StoreStructure>;

export default fetchTables;
