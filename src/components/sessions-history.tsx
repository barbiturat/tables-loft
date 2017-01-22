import * as React from 'react';

import {TableSessions} from '../interfaces/store-models';
import TableHistorySession from './table-history-session';

interface Props {
  tableSessions?: TableSessions;
  isInPending: boolean;
  firstIdx: number;
}

export default class SessionsHistory extends React.Component<Props, {}> {
  static getRenderedSessions(tableSessions: TableSessions = {}, firstIdx: number) {
    return Object.keys(tableSessions).map((key, idx) => {
      const keyNum = Number(key);
      const session = tableSessions[keyNum];

      return (
        <TableHistorySession
          key={idx}
          session={session}
          idx={idx + firstIdx + 1}
        />
      );
    });

  }

  static getTableSessions (sessions: TableSessions = {}, isInPending: boolean, firstIdx: number) {
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
