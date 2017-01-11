import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {MiddlewareAPI} from 'redux';
import {find, assign, clone} from 'lodash';

import {REQUESTING_TABLE_SESSION_CHANGE} from '../constants/action-names';
import {request} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseUpdateTableSessionPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, Partial} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {urlUpdateTableSession} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import {RequestUpdateTableSessionPayload} from '../interfaces/api-requests';
import {StoreStructure, TableSession, TableSessions} from '../interfaces/store-models';
import {ActionType} from '../action-creators/requesting-table-session-change';

type ResponseOk = AjaxResponseTyped<ResponseUpdateTableSessionPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const getSessionById = (array: TableSession[], id: number) => {
  return find(array, (el: TableSession) => {
    return el.id === id;
  });
};

const setNewParamsToSession = (sessions: TableSessions, sessionId: number, params: Partial<TableSession>) => {
  const session = sessions[sessionId];

  if (session) {
    assign(session, params);
  }

  return sessions;
};


const requestTableSessionChange = ((action$, store: MiddlewareAPI<StoreStructure>) => {
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
      const setSessionsWithPending$ = Observable.of( tableSessionsChanged(newSessions) );
      const url = urlUpdateTableSession.replace(':session_id', String(sessionId));

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
                const setSessionsAction = tableSessionsChanged(editedSessions);

                return Observable.of<any>(
                  setSessionsAction
                );
              } else {
                return Observable.of<any>(
                  {
                    type: 'error'
                  }
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
