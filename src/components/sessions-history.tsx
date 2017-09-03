import * as React from 'react';

import { TableSessionStore } from '../interfaces/store-models';
import TableHistorySession from './table-history-session';

interface Props {
  readonly tableSessions?: ReadonlyArray<TableSessionStore>;
  readonly isInPending: boolean;
  readonly firstIdx: number;
}

const getRenderedSessions = (
  tableSessions: ReadonlyArray<TableSessionStore> = [],
  firstIdx: number
) =>
  tableSessions.map((session, idx) =>
    <TableHistorySession key={idx} session={session} idx={idx + firstIdx + 1} />
  );

const getTableSessions = (
  sessions: ReadonlyArray<TableSessionStore> = [],
  isInPending: boolean,
  firstIdx: number
) => {
  if (isInPending) {
    return <div className="sessions-list__wait" />;
  } else if (!Object.keys(sessions).length) {
    return <div className="sessions-list__message">No sessions</div>;
  } else {
    return (
      <div className="sessions-list">
        <div className="sessions-list__header">
          <div className="sessions-list__th sessions-list__th_role_time">Start Time</div>
          <div className="sessions-list__th sessions-list__th_role_duration">Duration</div>
        </div>

        {getRenderedSessions(sessions, firstIdx)}
      </div>
    );
  }
};

const SessionsHistory = (props: Props) =>
  <div className="sessions-screen">
    {getTableSessions(props.tableSessions, props.isInPending, props.firstIdx)}
  </div>;

export default SessionsHistory;
