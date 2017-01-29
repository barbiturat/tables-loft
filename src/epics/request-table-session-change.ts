import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {pipe, when, merge, clone, prop, objOf, flip} from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import {REQUESTING_TABLE_SESSION_CHANGE} from '../constants/action-names';
import {request, getRequestFailedAction, isAjaxResponseDefined} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseUpdateTableSessionPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, Partial, AjaxResponseDefined} from '../interfaces/index';
import {urlUpdateTableSession} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import changingTableSessions from '../action-creators/changing-table-sessions';
import {RequestUpdateTableSessionPayload} from '../interfaces/api-requests';
import {StoreStructure, TableSession, TableSessions} from '../interfaces/store-models';
import {ActionType} from '../action-creators/requesting-table-session-change';
import {API_URL} from '../constants/index';
import {validateResponse} from '../helpers/dynamic-type-validators/index';
import pendingBlockingRequest from '../action-creators/pending-blocking-request';

type ResponseOk = AjaxResponseTyped<ResponseUpdateTableSessionPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseUpdateTableSessionPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseUpdateTableSessionPayload>t.interface({
  });

  validateResponse(tResponse, ajaxData);
};

const setNewParamsToSession = (sessions: TableSessions, sessionId: number, params: Partial<TableSession>) => {
  const sId = String(sessionId);

  return pipe(
    when(prop(sId),
      pipe(
        prop(sId), // session
        flip(merge)(params), // update session
        objOf(sId), // {sId: session}
        merge(sessions) // updated sessions
      )
    )
  )(sessions);
};

const requestTableSessionChange = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(REQUESTING_TABLE_SESSION_CHANGE)
    .switchMap((action: ActionType) => {
      const storeData = store.getState();
      const adminToken = storeData.app.adminToken;

      if (!adminToken) {
        return Observable.of(null);
      }

      const {sessionId, durationSeconds} = action.payload;
      const dataToSend: RequestUpdateTableSessionPayload = {
        sessionId,
        durationSeconds,
        adminToken
      };
      const currSessionsClone = {...storeData.app.tableSessionsData.tableSessions};
      const newSessions = setNewParamsToSession(currSessionsClone, sessionId, {
        isInPending: true
      });
      const blockingPendingTurnOn$ = Observable.of( pendingBlockingRequest(true) );
      const setSessionsWithPending$ = Observable.of( changingTableSessions(newSessions) );
      const url = `${API_URL}${urlUpdateTableSession}`.replace(':session_id', String(sessionId));

      const request$ = Observable.of(null)
        .mergeMap(() =>
          request('PATCH', url, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              const blockingPendingTurnOffAction = pendingBlockingRequest(false);

              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                assertResponse(ajaxData);

                const sessionsClone: TableSessions = {...store.getState().app.tableSessionsData.tableSessions};
                const editedSessions = setNewParamsToSession(sessionsClone, sessionId, {
                  isInPending: false,
                  durationSeconds,
                  adminEdited: true
                });
                const changingTableSessionsAction = changingTableSessions(editedSessions);

                return Observable.of<any>(
                  blockingPendingTurnOffAction,
                  changingTableSessionsAction
                );
              } else {
                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Table session change error');

                return Observable.of<any>(
                  blockingPendingTurnOffAction,
                  fetchFailedAction
                );
              }
            })
        );

      return Observable.concat(
        blockingPendingTurnOn$,
        setSessionsWithPending$,
        request$
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default requestTableSessionChange;
