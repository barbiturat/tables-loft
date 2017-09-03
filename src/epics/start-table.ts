import { Observable } from 'rxjs';
import { Action, BaseAction } from 'redux-actions';
import { Epic } from 'redux-observable';
import { Store } from 'redux';
import { pipe, merge, clone } from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import { REQUESTING_TABLE_START } from '../constants/action-names';
import { post, isAjaxResponseDefined, getRequestFailedAction } from '../helpers/requests';
import { ResponseFailedPayload, ResponseStartTablePayload } from '../interfaces/api-responses';
import { AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined } from '../interfaces/index';
import { urlStartTable } from '../constants/urls';
import { ActionType } from '../action-creators/requesting-table-start';
import { StoreStructure, TableSessionsStore } from '../interfaces/store-models';
import changingTableSessions from '../action-creators/changing-table-sessions';
import { tableSessionToFront } from '../helpers/api-data-converters';
import { API_URL } from '../constants/index';
import changingTableFields from '../action-creators/changing-table-fields';
import { tTableSession } from '../helpers/dynamic-type-validators/types';
import { validateResponse } from '../helpers/dynamic-type-validators/index';

type ResponseOk = AjaxResponseTyped<ResponseStartTablePayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseStartTablePayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseStartTablePayload>t.interface({
    session: tTableSession
  });

  validateResponse(tResponse, ajaxData);
};

const startTable = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(REQUESTING_TABLE_START).switchMap((action: ActionType) => {
    const tableId = action.payload;
    const pendingStart$ = Observable.of(
      changingTableFields(
        {
          isInPending: true
        },
        tableId
      )
    );
    const url = `${API_URL}${urlStartTable}`.replace(':table_id', String(tableId));
    const request$ = Observable.of(null).mergeMap(() =>
      post(url).mergeMap((ajaxData: ResponseOk | ResponseError) => {
        if (isAjaxResponseDefined<ResponseOkDefined>(ajaxData)) {
          assertResponse(ajaxData);

          const appData = store.getState().app;
          const convertedSession = tableSessionToFront(ajaxData.response.session);
          const tableSessionsChangedAction = pipe<
            TableSessionsStore,
            TableSessionsStore,
            TableSessionsStore,
            Action<TableSessionsStore>
          >(
            clone,
            merge({
              [convertedSession.id]: convertedSession
            }),
            changingTableSessions
          )(appData.tableSessionsData.tableSessions);

          const changingTableAction = changingTableFields(
            {
              currentSessionId: convertedSession.id,
              isInPending: false
            },
            tableId
          );

          return Observable.of<BaseAction>(tableSessionsChangedAction, changingTableAction);
        } else {
          const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Table start error: ');
          const pendingStopAction = changingTableFields(
            {
              isInPending: false
            },
            tableId
          );

          return Observable.of<BaseAction>(fetchFailedAction, pendingStopAction);
        }
      })
    );

    return Observable.concat(pendingStart$, request$);
  });
}) as Epic<BaseAction, StoreStructure>;

export default startTable;
