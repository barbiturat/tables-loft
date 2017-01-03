import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';

import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {get, getErrorMessageFromResponse} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseSessionsHistoryPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {urlSessionHistory} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {tableSessionsToFront} from '../helpers/api-data-converters/index';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import pendingTableSessionsHistory from '../action-creators/pending-table-sessions-history';
import fetchingTableSessionsHistoryFailed from '../action-creators/fetching-table-sessions-history-failed';
import {ActionType} from '../action-creators/fetching-table-sessions-history';
import {RequestSessionHistoryPayload} from '../interfaces/api-requests';

type ResponseOk = AjaxResponseTyped<ResponseSessionsHistoryPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const fetchSessionsHistory = ((action$) => {
  return action$.ofType(FETCHING_TABLE_SESSIONS_HISTORY)
    .switchMap((action: ActionType) => {
      const historyPendingStart$ = Observable.of(pendingTableSessionsHistory(true));
      const tableId = action.payload;
      const dataToSend: RequestSessionHistoryPayload = {
        tableId
      };

      const historyRequest$ = Observable.of(null)
        .mergeMap(() =>
          get(urlSessionHistory, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if (ajaxData.status === STATUS_OK) {
                const sessions = (ajaxData as ResponseOk).response.sessions;
                const convertedSessions = tableSessionsToFront(sessions);

                const setTableSessionsAction = tableSessionsChanged(convertedSessions);
                const historyPendingStartStopAction = pendingTableSessionsHistory(false);

                return Observable.of<any>(
                  setTableSessionsAction,
                  historyPendingStartStopAction
                );
              } else {
                const errorMessage = getErrorMessageFromResponse(ajaxData as ResponseError);

                return Observable.of<any>(
                  fetchingTableSessionsHistoryFailed(errorMessage)
                );
              }
            })
        );

      return Observable.concat(
        historyPendingStart$,
        historyRequest$
      );
    });
}) as Epic<SimpleAction>;

export default fetchSessionsHistory;
