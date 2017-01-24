import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {pipe, merge, clone} from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import {REQUESTING_TABLE_STOP} from '../constants/action-names';
import {post, isAjaxResponseDefined, getRequestFailedAction} from '../helpers/requests';
import {ResponseFailedPayload, ResponseStopTablePayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import {urlStopTable} from '../constants/urls';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {ActionType} from '../action-creators/requesting-table-start';
import {StoreStructure, TableSessions} from '../interfaces/store-models';
import changingTableSessions from '../action-creators/changing-table-sessions';
import {tableSessionToFront} from '../helpers/api-data-converters/index';
import {API_URL} from '../constants/index';
import changingTableFields from '../action-creators/changing-table-fields';
import {tTableSession} from '../helpers/dynamic-type-validators/types';
import {validateResponse} from '../helpers/dynamic-type-validators/index';

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

                const appData = store.getState().app;
                const convertedSession = tableSessionToFront( ajaxData.response.session );
                const tableSessionsChangedAction = pipe< TableSessions, TableSessions, TableSessions, ActionWithPayload<TableSessions> >(
                  clone,
                  merge({
                    [convertedSession.id]: convertedSession
                  }),
                  changingTableSessions
                )(appData.tableSessionsData.tableSessions);

                const changingTableAction = changingTableFields({
                  currentSessionId: null,
                  isInPending: false
                }, tableId);

                return Observable.of<any>(
                  tableSessionsChangedAction,
                  changingTableAction
                );
              } else {
                const pendingStopAction = changingTableFields({
                  isInPending: false
                }, tableId);
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
