import * as React from 'react';

import {TableSessions} from '../interfaces/store-models';
import TableHistorySession from './table-history-session';

interface Props {
  tableSessions?: TableSessions;
  isInPending: boolean;
}

export default class SessionsHistory extends React.Component<Props, {}> {
  static getRenderedSessions(tableSessions: TableSessions = {}) {
    return Object.keys(tableSessions).map((key) => {
      const idx = Number(key);
      const session = tableSessions[idx];

      return (
        <TableHistorySession
          key={idx}
          session={session}
        />
      );
    });

  }

  static getTableSessions (tableSessions: TableSessions = {}, isInPending: boolean) {
    if (isInPending) {
      return (
        <div>Wait...</div>
      );
    } else {
      return (
        <div className="sessions-list">

          <div className="sessions-list__header">
            <div className="sessions-list__th sessions-list__th_role_index">Session</div>
            <div className="sessions-list__th sessions-list__th_role_time">Time</div>
            <div className="sessions-list__th sessions-list__th_role_duration">Playing Time</div>
          </div>

          {SessionsHistory.getRenderedSessions(tableSessions)}

        </div>

      );

    }
  };

  render() {
    return (
      <div className="sessions-screen">
        {SessionsHistory.getTableSessions(this.props.tableSessions, this.props.isInPending)}

        <div className="paginator">
          <div className="paginator__button paginator__button_role_prev">Prev</div>
          <div className="paginator__button paginator__button_role_page">1</div>
          <div className="paginator__button paginator__button_role_page">2</div>
          <div className="paginator__button paginator__button_role_page">3</div>
          <div className="paginator__button paginator__button_role_next">Next</div>
        </div>

      </div>
    );
  }
}
