import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;
import { createSelector, Selector } from 'reselect'

import {TableType} from '../interfaces/backend-models';
import {TableSession, StoreStructure} from '../interfaces/store-models';
import store from '../store/index';
import requestingTableStart from '../action-creators/requesting-table-start';
import requestingTableStop from '../action-creators/requesting-table-stop';
import {PropsExtendedByConnect} from '../interfaces/component';

export type TableStatus = 'ready' | 'active';

interface Props {
  id: number;
  type?: TableType;
  currentSession?: TableSession;
  lastSession?: TableSession;
  name?: string;
  isInPending?: boolean;
  isDisabled?: boolean;
}

interface State {
  durationOfActivityStr: string;
}

interface MappedProps {
  utcMilliseconds: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Table extends React.Component<PropsFromConnect, State> {
  static defaultProps = {
    type: 'generic',
    name: 'No Name',
    isInPending: false,
    isDisabled: false
  };

  isTableActiveSelector: Selector<TableSession, boolean>;

  constructor(props: Props) {
    super(props);

    const startsAt = props.currentSession ? props.currentSession.startsAt : null;

    this.state = {
      durationOfActivityStr: Table.getDurationActivityString(startsAt)
    };

    this.isTableActiveSelector = createSelector(
      Table.startsAtSelector,
      Table.durationSecondsSelector,
      (startsAt, durationSeconds) => {
        const tableStatus = Table.getTableStatus(startsAt, durationSeconds);
        return tableStatus == 'active';
      }
    )
  }

  static getDurationActivityString(startsAt: number) {
    if (!startsAt) {
      return ''
    }

    const now = moment.utc().valueOf();
    const durationMs = now - startsAt;

    return moment.utc(durationMs)
      .format('H[h] mm[m] ss[s]');
  }

  static getTableStatus(startsAt: number, durationSeconds: number): TableStatus {
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


  static startsAtSelector(currentSession: TableSession) {
    return currentSession ? currentSession.startsAt : null;
  };

  static durationSecondsSelector(currentSession: TableSession) {
    return currentSession ? currentSession.durationSeconds : null;
  };

  static getLastSessionInfo(lastSession: TableSession) {
    if (lastSession) {
      const {durationSeconds, startsAt, adminEdited} = lastSession;
      const finishTime = moment.utc(startsAt)
          .add({
            seconds: durationSeconds
          })
          .format('hh:mm');
      const duration = moment.duration({seconds: durationSeconds});
      const durationString = moment.utc({
        hours: duration.hours(),
        minutes: duration.minutes()
      })
        .format("H[h] mm[m]");
      const adminEditedClassName = adminEdited ? 'table__session-length_admin-edited' : '';

      return (
        <div className="table__session-info">
          <span className="table__session-name">Last Session</span>
          <span className="table__session-finish-time">{finishTime}</span>
          <span className={`table__session-length ${adminEditedClassName}`}>{durationString}</span>
        </div>
      );
    } else {
      return (
        <div className="table__session-info">
          <div className="table__label table__label_role_no-session">No Sessions Today</div>
        </div>
      );
    }
  };

  static getDisabledLabel(isDisabled: boolean) {
    return isDisabled ? (
        <span className="table__label table__label_role_disabled">
          Pool Table 2 Is Not Active
        </span>
      ) : null;
  };

  static renderActiveSessionStartTime(currentSession: TableSession) {
    if (!currentSession) {
      return null;
    } else {
      const startTime = moment.utc(currentSession.startsAt).format('H[h] mm[m]');

      return (
        <div className="table__label table__label_role_start-time">{startTime}</div>
      )
    }
  };

  onChangeStatusClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const {id, isDisabled, currentSession} = this.props;

    if (isDisabled) {
      return;
    }

    const actionCreator = this.isTableActiveSelector(currentSession) ? requestingTableStop : requestingTableStart;
    const action = actionCreator(id);

    store.dispatch(action);
  };

  render() {
    const {name, type, lastSession, currentSession, isInPending, isDisabled} = this.props;
    const isActive = this.isTableActiveSelector(currentSession);
    const tableTypeClassName = {
      pool: 'table_type_pool',
      shuffleBoard: 'table_type_shuffle',
      tableTennis: 'table_type_tennis',
      generic: 'table_type_default'
    }[type];
    const statusClassName = isActive ? 'table_status_active' : 'table_status_ready';
    const pendingClassName = isInPending ? 'table_state_in-pending' : '';
    const labelAvailableText = !isActive ? 'Available' : this.state.durationOfActivityStr;

    return (
      <div className={`table ${tableTypeClassName} ${statusClassName} ${pendingClassName} tables-set_adjust_table`}>
        {Table.getDisabledLabel(isDisabled)}
        <div className="table__label table__label_role_table-type">
          {name}
        </div>
        {isActive ? Table.renderActiveSessionStartTime(currentSession) : ''}
        <a href=""
           className="table__button table__button_role_change-availability"
           onClick={this.onChangeStatusClick}
        />
        <div className="table__label table__label_role_availability">
          {labelAvailableText}
        </div>
        {Table.getLastSessionInfo(lastSession)}
        <a href="" className="table__btn-view-sessions">View More</a>
      </div>
    );
  }
}

export default connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      utcMilliseconds: state.app.utcMilliseconds
    };
  }
)(Table);
