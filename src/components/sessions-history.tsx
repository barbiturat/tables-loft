import * as React from 'react';

import {TableSessions, TableSession} from '../interfaces/store-models';
import TableHistorySession from './table-history-session';

interface Props {
  readonly tableSessions?: TableSession[];
  readonly isInPending: boolean;
  readonly firstIdx: number;
}

export default class SessionsHistory extends React.Component<Props, {}> {
  static getRenderedSessions(tableSessions: TableSession[] = [], firstIdx: number) {
    return tableSessions.map((session, idx) =>
      <TableHistorySession
        key={idx}
        session={session}
        idx={idx + firstIdx + 1}
      />
    );

  }

  static getTableSessions (sessions: TableSession[] = [], isInPending: boolean, firstIdx: number) {
    if (isInPending) {
      return (
        <div className="sessions-list__wait"/>
      );
    } else if (!Object.keys(sessions).length) {
      return (
        <div className="sessions-list__message">
          No sessions
        </div>
      );
    } else {
      return (
        <div className="sessions-list">

          <div className="sessions-list__header">
            <div className="sessions-list__th sessions-list__th_role_time">Start Time</div>
            <div className="sessions-list__th sessions-list__th_role_duration">Duration</div>
          </div>

          {SessionsHistory.getRenderedSessions(sessions, firstIdx)}
        </div>
      );
    }
  };

  render() {
    return (
      <div className="sessions-screen">
        {SessionsHistory.getTableSessions(this.props.tableSessions, this.props.isInPending, this.props.firstIdx)}
      </div>
    );
  }
}
