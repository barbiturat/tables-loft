import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;

import TableSession from './table-session';
import { TableType } from '../interfaces/backend-models';
import {
  TableSessionStore,
  StoreStructure,
  TableSessionsStore
} from '../interfaces/store-models';
import requestingTableStart from '../action-creators/requesting-table-start';
import requestingTableStop from '../action-creators/requesting-table-stop';
import TableTimer from './table-timer';
import fetchingTableSessionsHistory from '../action-creators/fetching-table-sessions-history';
import modalSessionsHistoryChanged from '../action-creators/modal-sessions-history-changed';
import ModalPrompt from './modal-prompt';
import { compose, defaultProps, withHandlers, withState } from 'recompose';
import { StringDict } from '../interfaces/index';
import * as R from 'ramda';

export interface Props {
  readonly id: number;
  readonly type?: TableType;
  readonly currentSessionId?: number;
  readonly lastSessionId?: number;
  readonly name?: string;
  readonly isInPending?: boolean;
  readonly isDisabled?: boolean;
}

interface MappedProps {
  readonly sessions: TableSessionsStore;
}

const isTableActive = (currentSession?: TableSessionStore): boolean =>
  !!currentSession;

const startsAtSelector = (currentSession?: TableSessionStore) =>
  currentSession && currentSession.startsAt;

const getDisabledLabel = (isDisabled?: boolean) =>
  isDisabled
    ? <span className="table__label table__label_role_disabled">
        Pool Table 2 Is Not Active
      </span>
    : null;

const renderActiveSessionStartTime = (currentSession?: TableSessionStore) => {
  if (!currentSession) {
    return null;
  } else {
    const startTime = moment.utc(currentSession.startsAt).format('H[h] mm[m]');

    return (
      <div className="table__label table__label_role_start-time">
        {startTime}
      </div>
    );
  }
};

const enhance = compose(
  withState('isPromptOpen', 'setPromptOpen', false),
  withState('promptMessage', 'setPromptMessage', ''),
  defaultProps({
    type: 'generic' as TableType,
    name: 'No Name',
    isInPending: false,
    isDisabled: false
  }),
  withHandlers({
    getCurrentSession: ({ sessions, currentSessionId }) => () =>
      sessions[currentSessionId],
    onPromptClose: ({ setPromptOpen }) => () => {
      setPromptOpen(false);
    },
    onViewMoreClick: ({ dispatch, id }) => (
      event: MouseEvent<HTMLAnchorElement>
    ) => {
      event.preventDefault();

      dispatch(fetchingTableSessionsHistory(id));
      dispatch(modalSessionsHistoryChanged(true, id));

      event.currentTarget.blur();
    }
  }),
  withHandlers({
    onPromptOk: ({ dispatch, getCurrentSession, id, isDisabled }) => () => {
      if (isDisabled) {
        return;
      }

      const getActionCreator = (identyfier: number) =>
        (isTableActive(getCurrentSession())
          ? requestingTableStop
          : requestingTableStart)(identyfier);

      R.compose(dispatch, getActionCreator)(id);
    },
    onChangeStatusClick: ({
      getCurrentSession,
      name,
      setPromptOpen,
      setPromptMessage
    }) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      // throw('test rollbar sourcemaps support');

      const getPromptMessage = (toStop: boolean) =>
        `${toStop ? 'Stop' : 'Start'} table "${name}"`;

      setPromptOpen(true);
      R.compose(setPromptMessage, getPromptMessage, isTableActive)(
        getCurrentSession()
      );
    }
  })
);

const Component = enhance(
  ({
    name,
    type,
    isInPending,
    isDisabled,
    getCurrentSession,
    onChangeStatusClick,
    onViewMoreClick,
    lastSessionId,
    onPromptOk,
    onPromptClose,
    isPromptOpen,
    promptMessage
  }: any) => {
    const isActive = isTableActive(getCurrentSession());
    const getTableTypeClassName = () =>
      type
        ? ({
            pool: 'table_type_pool',
            shuffleBoard: 'table_type_shuffle',
            tableTennis: 'table_type_tennis',
            generic: 'table_type_default'
          } as StringDict)[type]
        : '';
    const getStatusClassName = () =>
      isActive ? 'table_status_active' : 'table_status_ready';
    const getPendingClassName = () =>
      isInPending ? 'table_state_in-pending' : '';
    const getFullClassName = () =>
      `table ${getTableTypeClassName()} ${getStatusClassName()} ${getPendingClassName()} tables-set_adjust_table`;

    return (
      <div className={getFullClassName()}>
        {getDisabledLabel(isDisabled)}
        <div className="table__label table__label_role_table-type">
          {name}
        </div>
        {isActive ? renderActiveSessionStartTime(getCurrentSession()) : ''}
        <a
          href=""
          className="table__button table__button_role_change-availability"
          onClick={onChangeStatusClick}
        />
        <TableTimer
          isActive={isActive}
          startsAt={startsAtSelector(getCurrentSession())}
        />
        <TableSession sessionId={lastSessionId} />
        <a
          href=""
          className="table__btn-view-sessions"
          onClick={onViewMoreClick}
        >
          View More
        </a>

        <ModalPrompt
          isOpen={isPromptOpen}
          onClickOk={onPromptOk}
          onClose={onPromptClose}
          message={promptMessage}
        />
      </div>
    );
  }
);

const Table = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => ({
  sessions: state.app.tableSessionsData.tableSessions
}))(Component);

export default Table;
