import {Observable} from 'rxjs';
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
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
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

                const tableSessionsChangedAction = pipe< TableSessions, TableSessions, TableSessions, ActionWithPayload<TableSessions> >(
                  clone,
                  (sessions) => pipe<TableSession, TableSessionFrontend, IndexedDict<TableSessionFrontend>, TableSessions >(
                    tableSessionToFront, // converted table session
                    (convertedSession) => ({ // creates new table session record for tableSessions
                      [convertedSession.id]: convertedSession
                    }),
                    merge(sessions)
                  )(ajaxData.response.session),
                  changingTableSessions
                )(tableSessionsData.tableSessions);

                const changingTableAction = pipe<(Table | undefined), (ChangingTableFieldsAction | null)>(
                  ifElse(Boolean,
                    (currTable) => changingTableFields({
                      currentSessionId: null,
                      lastSessionId: currTable.currentSessionId,
                      isInPending: false
                    }, tableId),
                    null
                  )
                )(tablesData.tables[tableId]);

                const actions: SimpleAction[] = [tableSessionsChangedAction];

                if (changingTableAction) {
                  actions.push(changingTableAction);
                }

                return Observable.from<SimpleAction>(actions);
              } else {
                const pendingStopAction = changingTableFields({
                  isInPending: false
                }, tableId);
                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Table stop error');

                return Observable.of<SimpleAction>(
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
}) as Epic<SimpleAction, StoreStructure>;

export default stopTable;
