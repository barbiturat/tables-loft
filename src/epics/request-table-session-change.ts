import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {pipe, when, merge, clone, prop, objOf, flip} from 'ramda';

import {REQUESTING_TABLE_SESSION_CHANGE} from '../constants/action-names';
import {request, getRequestFailedAction} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseUpdateTableSessionPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, Partial} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {urlUpdateTableSession} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import changingTableSessions from '../action-creators/changing-table-sessions';
import {RequestUpdateTableSessionPayload} from '../interfaces/api-requests';
import {StoreStructure, TableSession, TableSessions} from '../interfaces/store-models';
import {ActionType} from '../action-creators/requesting-table-session-change';
import {API_URL} from '../constants/index';

type ResponseOk = AjaxResponseTyped<ResponseUpdateTableSessionPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

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
      const {sessionId, durationSeconds, adminToken} = action.payload;
      const dataToSend: RequestUpdateTableSessionPayload = {
        sessionId,
        durationSeconds,
        adminToken
      };
      const currSessionsClone = clone( store.getState().app.tableSessionsData.tableSessions );
      const newSessions = setNewParamsToSession(currSessionsClone, sessionId, {
        isInPending: true
      });
      const setSessionsWithPending$ = Observable.of( changingTableSessions(newSessions) );
      const url = `${API_URL}${urlUpdateTableSession}`.replace(':session_id', String(sessionId));

      const request$ = Observable.of(null)
        .mergeMap(() =>
          request('PATCH', url, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if (ajaxData.status === STATUS_OK) {
                const sessionsClone: TableSessions = clone( store.getState().app.tableSessionsData.tableSessions );
                const editedSessions = setNewParamsToSession(sessionsClone, sessionId, {
                  isInPending: false,
                  durationSeconds,
                  adminEdited: true
                });
                const changingTableSessionsAction = changingTableSessions(editedSessions);

                return Observable.of<any>(
                  changingTableSessionsAction
                );
              } else {
                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Table session change error');

                return Observable.of<any>(
                  fetchFailedAction
                );
              }
            })
        );

      return Observable.concat(
        setSessionsWithPending$,
        request$
      );
    });
}) as Epic<SimpleAction>;

export default requestTableSessionChange;
