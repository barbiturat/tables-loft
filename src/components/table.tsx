import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import {TableType, TableStatus} from '../interfaces/backend-models';
import {TableSession} from '../interfaces/store-models';

interface Props {
  type?: TableType;
  status?: TableStatus;
  currentSession?: TableSession;
  lastSession?: TableSession;
  name?: string;
}

export default class Table extends React.Component<Props, AnyDict> {
  static defaultProps = {
    type: 'generic',
    status: 'ready',
    currentSession: (null as TableSession),
    lastSession: (null as TableSession),
    name: 'No Name'
  };

  getTimerText = () => {
    return '1h 30m 16s';
  };

  getLastSessionInfo = (lastSession: TableSession) => {
    return lastSession ? (
        <div className="table__session-info">
          <span className="table__session-name">Last Session</span>
          <span className="table__session-finish-time">20:30</span>
          <span className="table__session-length">1h 10m</span>
        </div>
      ) : (
        <div className="table__session-info">
          <div className="table__label table__label_role_no-session">No Sessions Today</div>
        </div>
      );
  };

  getDisabledLabel = (isDisabled: boolean) => {
    return isDisabled ? (
        <span className="table__label table__label_role_disabled">
          Pool Table 2 Is Not Active
        </span>
      ) : null;
  };

  render() {
    const {name, status, type, lastSession} = this.props;

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

    const labelAvailableText = status === 'active' ? 'Available' : this.getTimerText();

    return (
      <div className={`table ${tableTypeClassName} ${statusClassName} tables-set_adjust_table`}>
        {this.getDisabledLabel(status === 'disabled')}
        <div className="table__label table__label_role_table-type">
          {name}
        </div>
        <a href="" className="table__button table__button_role_change-availability"/>
        <div className="table__label table__label_role_availability">
          {labelAvailableText}
        </div>
        {this.getLastSessionInfo(lastSession)}
        <a href="" className="table__btn-view-sessions">View More</a>
      </div>
    );
  }
}
