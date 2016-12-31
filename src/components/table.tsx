import * as React from 'react';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;

import {AnyDict} from '../interfaces/index';
import {TableType} from '../interfaces/backend-models';
import {TableSession} from '../interfaces/store-models';
import store from '../store/index';
import requestingTableStart from '../action-creators/requesting-table-start';
import requestingTableStop from '../action-creators/requesting-table-stop';

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

export default class Table extends React.Component<Props, AnyDict> {
  static defaultProps = {
    type: 'generic',
    name: 'No Name',
    isInPending: false,
    isDisabled: false
  };

  status: TableStatus;

  constructor(props: Props) {
    super(props);

    this.status = Table.getTableStatus(props.currentSession);
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisCurrentSession = this.props.currentSession;
    const nextCurrentSession = nextProps.currentSession;

    if (nextCurrentSession.startsAt !== thisCurrentSession.startsAt ||
          nextCurrentSession.durationSeconds !== thisCurrentSession.durationSeconds) {
      this.status = Table.getTableStatus(this.props.currentSession);
    }
  }

  getTimerText = () => {
    return '1h 30m 16s';
  };

  static getTableStatus(currentSession: TableSession): TableStatus {
    if (!currentSession) {
      return 'ready';
    }

    const {startsAt, durationSeconds} = currentSession;
    const now = moment.utc().valueOf();
    const sessionFinishTime = moment.utc(startsAt)
      .add({
        seconds: durationSeconds
      })
      .valueOf();
    const isNotFinished = sessionFinishTime - now >= 0;

    return isNotFinished ? 'active' : 'ready';
  }

  getLastSessionInfo = (lastSession: TableSession) => {
    if (lastSession) {
      const {durationSeconds, startsAt, adminEdited} = lastSession;
      const finishTime = moment.utc(startsAt)
          .add({
            seconds: durationSeconds
          })
          .format('hh:mm');
      const duration = moment.duration({seconds: durationSeconds});
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
    if (!currentSession) {
      return null;
    } else {
      const startTime = moment(currentSession.startsAt).format('hh:mm');

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

    const actionCreator = Table.getTableStatus(currentSession) === 'ready' ? requestingTableStart : requestingTableStop;
    const action = actionCreator(id);

    store.dispatch(action);
  };

  render() {
    const {name, type, lastSession, currentSession, isInPending, isDisabled} = this.props;
    const isActive = Table.getTableStatus(currentSession) === 'active';
    const tableTypeClassName = {
      pool: 'table_type_pool',
      shuffleBoard: 'table_type_shuffle',
      tableTennis: 'table_type_tennis',
      generic: 'table_type_default'
    }[type];
    const statusClassName = isActive ? 'table_status_active' : 'table_status_ready';
    const pendingClassName = isInPending ? 'table_state_in-pending' : '';
    const labelAvailableText = !isActive ? 'Available' : this.getTimerText();

    return (
      <div className={`table ${tableTypeClassName} ${statusClassName} ${pendingClassName} tables-set_adjust_table`}>
        {this.getDisabledLabel(isDisabled)}
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
