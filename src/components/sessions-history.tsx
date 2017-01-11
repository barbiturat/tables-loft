import * as React from 'react';

import {TableSessions} from '../interfaces/store-models';
import TableHistorySession from './table-history-session';

interface Props {
  tableSessions?: TableSessions;
  isInPending: boolean;
}

export default class SessionsHistory extends React.Component<Props, {}> {
  static getTableSessions (tableSessions: TableSessions = {}, isInPending: boolean) {
    if (isInPending) {
      return (
        <div>Wait...</div>
      );
    } else {
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
  };

  render() {
    return (
      <div className="table-sessions-set">
        {SessionsHistory.getTableSessions(this.props.tableSessions, this.props.isInPending)}
      </div>
    );
  }
}
