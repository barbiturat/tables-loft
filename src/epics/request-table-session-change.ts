import { Observable } from 'rxjs';
import { Action, BaseAction } from 'redux-actions';
import { Epic } from 'redux-observable';
import { Store } from 'redux';
import { pipe, when, merge, prop, objOf, flip, clone, ifElse } from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import { REQUESTING_TABLE_SESSION_CHANGE } from '../constants/action-names';
import {
  request,
  getRequestFailedAction,
  isAjaxResponseDefined
} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseUpdateTableSessionPayload
} from '../interfaces/api-responses';
import {
  AjaxResponseTyped,
  AjaxErrorTyped,
  Partial,
  AjaxResponseDefined
} from '../interfaces/index';
import { urlUpdateTableSession } from '../constants/urls';
import changingTableSessions from '../action-creators/changing-table-sessions';
import { RequestUpdateTableSessionPayload } from '../interfaces/api-requests';
import {
  StoreStructure,
  TableSession,
  TableSessions
} from '../interfaces/store-models';
import { ActionType } from '../action-creators/requesting-table-session-change';
import { API_URL } from '../constants/index';
import { validateResponse } from '../helpers/dynamic-type-validators/index';
import pendingBlockingRequest from '../action-creators/pending-blocking-request';

type ResponseOk = AjaxResponseTyped<ResponseUpdateTableSessionPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseUpdateTableSessionPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseUpdateTableSessionPayload>t.interface({});

  validateResponse(tResponse, ajaxData);
};

const setNewParamsToSession = (
  sessions: TableSessions,
  sessionId: number,
  params: Partial<TableSession>
) => {
  return pipe(
    when(
      Boolean, // if session exists
      pipe(
        flip(merge)(params), // update session
        objOf(String(sessionId)), // {sId: session}
        merge(sessions) // updated sessions
      )
    )
  )(sessions[sessionId]);
};

const requestTableSessionChange = ((action$, store: Store<StoreStructure>) => {
  return action$
    .ofType(REQUESTING_TABLE_SESSION_CHANGE)
    .switchMap((action: ActionType) => {
      const appData = store.getState().app;
      const adminToken = appData.adminToken;

      if (!adminToken) {
        return Observable.of(null);
      }

      const { sessionId, durationSeconds } = action.payload;

      const setSessionsWithPending$ = pipe<
        TableSessions,
        TableSessions,
        TableSessions,
        Action<TableSessions>,
        Observable<Action<TableSessions>>
      >(
        clone,
        currSessionsClone =>
          setNewParamsToSession(currSessionsClone, sessionId, {
            isInPending: true
          }),
        changingTableSessions,
        Observable.of
      )(appData.tableSessionsData.tableSessions);

      const blockingPendingTurnOn$ = Observable.of(
        pendingBlockingRequest(true)
      );

      const url = `${API_URL}${urlUpdateTableSession}`.replace(
        ':session_id',
        String(sessionId)
      );
      const dataToSend: RequestUpdateTableSessionPayload = {
        sessionId,
        durationSeconds,
        adminToken
      };

      const request$ = Observable.of(null).mergeMap(() =>
        request(
          'PATCH',
          url,
          dataToSend
        ).mergeMap((ajaxData: ResponseOk | ResponseError) => {
          const blockingPendingTurnOffAction = pendingBlockingRequest(false);

          if (isAjaxResponseDefined<ResponseOkDefined>(ajaxData)) {
            assertResponse(ajaxData);

            const sessionsClone: TableSessions = {
              ...store.getState().app.tableSessionsData.tableSessions
            };
            const editedSessions = setNewParamsToSession(
              sessionsClone,
              sessionId,
              {
                isInPending: false,
                durationSeconds,
                adminEdited: true
              }
            );
            const changingTableSessionsAction = changingTableSessions(
              editedSessions
            );

            return Observable.of<BaseAction>(
              blockingPendingTurnOffAction,
              changingTableSessionsAction
            );
          } else {
            const fetchFailedAction = getRequestFailedAction(
              ajaxData.status,
              'Table session change error'
            );

            return Observable.of<BaseAction>(
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
}) as Epic<BaseAction, StoreStructure>;

export default requestTableSessionChange;
