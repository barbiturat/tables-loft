import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;
import {assign} from 'lodash';

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
  isTableActive: boolean;
  durationOfActivityStr: string;
}

interface MappedProps {
  qqq: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Table extends React.Component<Props, State> {
  static defaultProps = {
    type: 'generic',
    name: 'No Name',
    isInPending: false,
    isDisabled: false
  };

  activityTimer: number = null;

  constructor(props: Props) {
    super(props);

    const isTableActive = Table.getTableStatus(props.currentSession) === 'active';
    const startsAt = props.currentSession ? props.currentSession.startsAt : null;

    this.state = {
      isTableActive,
      durationOfActivityStr: Table.getDurationActivityString(startsAt)
    };

    if (isTableActive) {
      this.activityTimer = window.setInterval((() => {
        this.setState(assign({}, this.state, {
          durationOfActivityStr: Table.getDurationActivityString(this.props.currentSession.startsAt)
        }));
      }), 1000);
    }
  }

  componentWillUnmount() {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisCurrentSession = this.props.currentSession;
    const nextCurrentSession = nextProps.currentSession;

    if (
      nextCurrentSession !== thisCurrentSession ||
      nextCurrentSession.startsAt !== thisCurrentSession.startsAt ||
      nextCurrentSession.durationSeconds !== thisCurrentSession.durationSeconds
    ) {
      this.setState(assign({}, this.state, {
        isTableActive: Table.getTableStatus(nextCurrentSession) === 'active'
      }));
    }
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
      const startTime = moment.utc(currentSession.startsAt).format('H[h] mm[m]');

      return (
        <div className="table__label table__label_role_start-time">{startTime}</div>
      )
    }
  };

  onChangeStatusClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const {id, isDisabled} = this.props;

    if (isDisabled) {
      return;
    }

    const actionCreator = this.state.isTableActive ? requestingTableStop : requestingTableStart;
    const action = actionCreator(id);

    store.dispatch(action);
  };

  render() {
    const {name, type, lastSession, currentSession, isInPending, isDisabled} = this.props;
    const isActive = this.state.isTableActive;
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

export default connect<any, any, Props>(
  (state: StoreStructure, ownProps?: Props): MappedProps => {
    return {
      qqq: 12
    };
  }
)(Table);
