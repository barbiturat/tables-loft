import {Observable} from 'rxjs';
import {BaseAction} from 'redux-actions';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {pipe, merge, clone, ifElse} from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import {REQUESTING_TABLE_STOP} from '../constants/action-names';
import {post, isAjaxResponseDefined, getRequestFailedAction} from '../helpers/requests';
import {ResponseFailedPayload, ResponseStopTablePayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined, IndexedDict} from '../interfaces/index';
import {urlStopTable} from '../constants/urls';
import {ActionWithPayload} from '../interfaces/actions';
import {ActionType} from '../action-creators/requesting-table-start';
import {StoreStructure, TableSessions, TableSession as TableSessionFrontend, Table} from '../interfaces/store-models';
import changingTableSessions from '../action-creators/changing-table-sessions';
import {tableSessionToFront} from '../helpers/api-data-converters';
import {API_URL} from '../constants/index';
import changingTableFields, {ActionType as ChangingTableFieldsAction} from '../action-creators/changing-table-fields';
import {tTableSession} from '../helpers/dynamic-type-validators/types';
import {validateResponse} from '../helpers/dynamic-type-validators/index';
import {TableSession} from '../interfaces/backend-models';

type ResponseOk = AjaxResponseTyped<ResponseStopTablePayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseStopTablePayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseStopTablePayload>t.interface({
    session: tTableSession
  });

  validateResponse(tResponse, ajaxData);
};

const createTableSessionsChangedAction = (storeTableSessions: TableSessions, responseSession: TableSession) =>
  pipe< TableSessions, TableSessions, TableSessions, ActionWithPayload<TableSessions> >(
    clone,
    (sessions) => pipe<TableSession, TableSessionFrontend, IndexedDict<TableSessionFrontend>, TableSessions >(
      tableSessionToFront, // converted table session
      (convertedSession) => ({ [convertedSession.id]: convertedSession }), // creates new table session record
      merge(sessions)
    )(responseSession),
    changingTableSessions
  )(storeTableSessions);

const createChangingTableAction = (storeTable: Table, tableId: number, responseSessionId: number) =>
  pipe<(Table | undefined), (ChangingTableFieldsAction | null)>(
    ifElse(Boolean,
      (currTable) => changingTableFields({
        currentSessionId: null,
        lastSessionId: responseSessionId,
        isInPending: false
      }, tableId),
      () => null
    )
  )(storeTable);

const stopTable = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(REQUESTING_TABLE_STOP)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const pendingStart$ = Observable.of(changingTableFields({
        isInPending: true
      }, tableId));
      const url = `${API_URL}${urlStopTable}`.replace(':table_id', String(tableId));
      const request$ = Observable.of(null)
        .mergeMap(() =>
          post(url)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                assertResponse(ajaxData);

                const {tableSessionsData, tablesData} = store.getState().app;
                const responseSession = ajaxData.response.session;

                const tableSessionsChangedAction = createTableSessionsChangedAction(tableSessionsData.tableSessions, responseSession);
                const changingTableAction = createChangingTableAction(tablesData.tables[tableId], tableId, responseSession.id);

                const actions: ReadonlyArray<BaseAction> = < ReadonlyArray<BaseAction> >[tableSessionsChangedAction, changingTableAction]
                  .filter(Boolean);

                return Observable.from<BaseAction>(actions);
              } else {
                const pendingStopAction = changingTableFields({
                  isInPending: false
                }, tableId);
                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Table stop error');

                return Observable.of<BaseAction>(
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
}) as Epic<BaseAction, StoreStructure>;

export default stopTable;
