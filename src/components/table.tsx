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

export type TableStatus = 'ready' | 'active';

interface Props {
  id: number;
  type?: TableType;
  currentSession?: TableSessionType;
  lastSession?: TableSessionType;
  name?: string;
  isInPending?: boolean;
  isDisabled?: boolean;
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  static defaultProps = {
    type: 'generic',
    name: 'No Name',
    isInPending: false,
    isDisabled: false
  };

  isTableActiveSelector: Selector<PropsFromConnect, boolean>;

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


  static startsAtSelector(props: PropsFromConnect) {
    return props.currentSession ? props.currentSession.startsAt : undefined;
  };

  static durationSecondsSelector(props: PropsFromConnect) {
    return props.currentSession ? props.currentSession.durationSeconds : undefined;
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

    const actionCreator = this.isTableActiveSelector(this.props) ? requestingTableStop : requestingTableStart;
    const action = actionCreator(id);

    store.dispatch(action);
  };

  render() {
    const {name, type, lastSession, currentSession, isInPending, isDisabled} = this.props;
    const isActive = this.isTableActiveSelector(this.props);
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
        {isActive ? Component.renderActiveSessionStartTime(currentSession) : ''}
        <a href=""
           className="table__button table__button_role_change-availability"
           onClick={this.onChangeStatusClick}
        />
        <TableTimer
          isActive={isActive}
          startsAt={Component.startsAtSelector(this.props)}
        />
        <TableSession session={lastSession} />
        <a href="" className="table__btn-view-sessions">View More</a>
      </div>
    );
  }
}

const Table = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {};
  }
)(Component);

export default Table;
