import * as React from 'react';

import {TableSession} from '../interfaces/store-models';

interface Props {
  tableSessions?: TableSession[];
  isInPending: boolean;
}

export default class SessionsHistory extends React.Component<Props, {}> {
  static getTableSessions (tableSessions: TableSession[] = [], isInPending: boolean) {
    if (isInPending) {
      return (
        <div>Wait...</div>
      );
    } else {
      return tableSessions.map((tableSession, idx) => {
        return (
          <div key={idx}>111</div>
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
