import * as React from 'react';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;

import {AnyDict} from '../interfaces/index';
import {TableType, TableStatus} from '../interfaces/backend-models';
import {TableSession} from '../interfaces/store-models';
import store from '../store/index';
import requestingTableStart from '../action-creators/requesting-table-start';

interface Props {
  id: number;
  type?: TableType;
  status?: TableStatus;
  currentSession?: TableSession;
  lastSession?: TableSession;
  name?: string;
  isInPending?: boolean;
}

export default class Table extends React.Component<Props, AnyDict> {
  static defaultProps = {
    type: 'generic',
    status: 'ready',
    currentSession: (null as TableSession),
    lastSession: (null as TableSession),
    name: 'No Name',
    isInPending: false
  };

  getTimerText = () => {
    return '1h 30m 16s';
  };

  getLastSessionInfo = (lastSession: TableSession) => {
    if (lastSession && lastSession.starts_at && lastSession.durationSeconds) {
      const {durationSeconds, starts_at, adminEdited} = lastSession;
      const finishTime = moment(starts_at, moment.ISO_8601)
          .add({
            seconds: durationSeconds
          })
          .format('hh:mm');
      const duration = moment.duration(durationSeconds, 'seconds');
      const durationString = moment({
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

  getDisabledLabel = (isDisabled: boolean) => {
    return isDisabled ? (
        <span className="table__label table__label_role_disabled">
          Pool Table 2 Is Not Active
        </span>
      ) : null;
  };

  renderActiveSessionStartTime = (currentSession: TableSession) => {
    if (!currentSession || !currentSession.starts_at) {
      return null;
    } else {
      const startTime = moment(currentSession.starts_at, moment.ISO_8601)
        .format('hh:mm');

      return (
        <div className="table__label table__label_role_start-time">{startTime}</div>
      )
    }
  };

  onChangeStatusClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const {status, id} = this.props;

    if (status === 'disabled') {
      return;
    }

    const action = requestingTableStart(id);

    store.dispatch(action);
  };

  render() {
    const {name, status, type, lastSession, currentSession, isInPending} = this.props;

    const tableTypeClassName = {
      pool: 'table_type_pool',
      shuffleBoard: 'table_type_shuffle',
      tableTennis: 'table_type_tennis',
      generic: 'table_type_default'
    }[type];

    const statusClassName = {
      ready: 'table_status_ready',
      active: 'table_status_active',
      disabled: 'table_status_disabled'
    }[status];

    const pendingClassName = isInPending ? 'table_state_in-pending' : '';

    const isActive = status === 'active';
    const labelAvailableText = !isActive ? 'Available' : this.getTimerText();

    return (
      <div className={`table ${tableTypeClassName} ${statusClassName} ${pendingClassName} tables-set_adjust_table`}>
        {this.getDisabledLabel(status === 'disabled')}
        <div className="table__label table__label_role_table-type">
          {name}
        </div>
        {isActive ? this.renderActiveSessionStartTime(currentSession) : ''}
        <a href=""
           className="table__button table__button_role_change-availability"
           onClick={this.onChangeStatusClick}
        />
        <div className="table__label table__label_role_availability">
          {labelAvailableText}
        </div>
        {this.getLastSessionInfo(lastSession)}
        <a href="" className="table__btn-view-sessions">View More</a>
      </div>
    );
  }
}
