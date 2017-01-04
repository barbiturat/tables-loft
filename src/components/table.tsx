import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;
import { createSelector, Selector } from 'reselect';

import TableSession from './table-session';
import {TableType} from '../interfaces/backend-models';
import {TableSession as TableSessionType, StoreStructure} from '../interfaces/store-models';
import store from '../store/index';
import requestingTableStart from '../action-creators/requesting-table-start';
import requestingTableStop from '../action-creators/requesting-table-stop';
import {PropsExtendedByConnect} from '../interfaces/component';
import TableTimer from './table-timer';
import fetchingTableSessionsHistory from '../action-creators/fetching-table-sessions-history';
import modalSessionsHistoryChanged from '../action-creators/modal-sessions-history-changed';
import {getElementById} from '../helpers/index';

export type TableStatus = 'ready' | 'active';

interface Props {
  id: number;
  type?: TableType;
  currentSessionId?: number;
  lastSessionId?: number;
  name?: string;
  isInPending?: boolean;
  isDisabled?: boolean;
}

interface MappedProps {
  sessions: TableSessionType[];
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  static defaultProps = {
    type: 'generic',
    name: 'No Name',
    isInPending: false,
    isDisabled: false
  };

  isTableActiveSelector: Selector<TableSessionType | undefined, boolean>;

  constructor(props: Props) {
    super(props);

    this.isTableActiveSelector = createSelector(
      Component.startsAtSelector,
      Component.durationSecondsSelector,
      (startsAt, durationSeconds) => {
        const tableStatus = Component.getTableStatus(startsAt, durationSeconds);
        return tableStatus === 'active';
      }
    );
  }

  getCurrentSession() {
    return getElementById(this.props.sessions, this.props.currentSessionId);
  }

  getLastSession() {
    return getElementById(this.props.sessions, this.props.lastSessionId);
  }

  static getTableStatus(startsAt?: number, durationSeconds?: number): TableStatus {
    if (!startsAt || !durationSeconds) {
      return 'ready';
    }

    const now = moment.utc().valueOf();
    const sessionFinishTime = moment.utc(startsAt)
      .add({
        seconds: durationSeconds
      })
      .valueOf();
    const isNotFinished = sessionFinishTime - now >= 0;

    return isNotFinished ? 'active' : 'ready';
  };


  static startsAtSelector(currentSession?: TableSessionType) {
    return currentSession && currentSession.startsAt;
  };

  static durationSecondsSelector(currentSession?: TableSessionType) {
    return currentSession && currentSession.durationSeconds;
  };

  static getDisabledLabel(isDisabled?: boolean) {
    return isDisabled ? (
        <span className="table__label table__label_role_disabled">
          Pool Table 2 Is Not Active
        </span>
      ) : null;
  };

  static renderActiveSessionStartTime(currentSession?: TableSessionType) {
    if (!currentSession) {
      return null;
    } else {
      const startTime = moment.utc(currentSession.startsAt).format('H[h] mm[m]');

      return (
        <div className="table__label table__label_role_start-time">{startTime}</div>
      );
    }
  };

  onChangeStatusClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const {id, isDisabled} = this.props;

    if (isDisabled) {
      return;
    }

    const actionCreator = this.isTableActiveSelector( this.getCurrentSession() ) ? requestingTableStop : requestingTableStart;
    const action = actionCreator(id);

    store.dispatch(action);
  };

  onViewMoreClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch( fetchingTableSessionsHistory(this.props.id) );
    this.props.dispatch( modalSessionsHistoryChanged(true, this.props.id) );

    event.currentTarget.blur();
  };

  render() {
    const {name, type, isInPending, isDisabled} = this.props;
    const isActive = this.isTableActiveSelector( this.getCurrentSession() );
    const tableTypeClassName = type ? {
      pool: 'table_type_pool',
      shuffleBoard: 'table_type_shuffle',
      tableTennis: 'table_type_tennis',
      generic: 'table_type_default'
    }[type] : '';
    const statusClassName = isActive ? 'table_status_active' : 'table_status_ready';
    const pendingClassName = isInPending ? 'table_state_in-pending' : '';

    return (
      <div className={`table ${tableTypeClassName} ${statusClassName} ${pendingClassName} tables-set_adjust_table`}>
        {Component.getDisabledLabel(isDisabled)}
        <div className="table__label table__label_role_table-type">
          {name}
        </div>
        {isActive ? Component.renderActiveSessionStartTime( this.getCurrentSession() ) : ''}
        <a href=""
           className="table__button table__button_role_change-availability"
           onClick={this.onChangeStatusClick}
        />
        <TableTimer
          isActive={isActive}
          startsAt={Component.startsAtSelector( this.getCurrentSession() )}
        />
        <TableSession session={ this.getLastSession() } />
        <a href=""
            className="table__btn-view-sessions"
            onClick={this.onViewMoreClick}
        >
          View More
        </a>
      </div>
    );
  }
}

const Table = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      sessions: state.app.tableSessionsData.tableSessions
    };
  }
)(Component);

export default Table;
