import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;
import KeyboardEvent = React.KeyboardEvent;
import {merge} from 'ramda';

import {StoreStructure, TableSession as TableSessionType} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import SessionEditBlock from './session-edit-block';

interface Props {
  sessionId?: number;
}

interface State {
  isFormatOfMinutes: boolean;
  isInEditing: boolean;
}

interface MappedProps {
  inAdminMode: boolean;
  session: TableSessionType | null;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface SessionDurationData {
  hours: number;
  minutes: number;
  minutesTotal: number;
}

class Component extends React.Component<PropsFromConnect, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isFormatOfMinutes: false,
      isInEditing: false
    };
  }

  componentWillReceiveProps(nextProps: PropsFromConnect) {
    if (!nextProps.inAdminMode) {
      this.setEditingMode(false);
    }
  }

  setEditingMode(turnOn: boolean) {
    this.setState(merge(this.state, {
      isInEditing: turnOn
    }));
  }

  static getSessionDurationData(durationSeconds: number): SessionDurationData {
    const duration = moment.duration({seconds: durationSeconds});

    return {
      hours: Math.floor( duration.asHours() ),
      minutes: Math.floor( duration.minutes() ),
      minutesTotal: Math.floor( duration.asMinutes() )
    };
  }

  onSessionInfoClick = (event: MouseEvent<HTMLDivElement>) => {
    this.setState(merge(this.state, {
      isFormatOfMinutes: !this.state.isFormatOfMinutes
    }));
  };

  static getDurationString(hours: number, minutes: number, minutesTotal: number, isFormatOfMinutes: boolean): string {
    if (isFormatOfMinutes) {
      return `${minutesTotal}m`;
    } else {
      return moment.utc({
        hours,
        minutes
      })
        .format('H[h] mm[m]');
    }
  }

  onEditButtonClick = (event: MouseEvent<HTMLDivElement>) => {
    this.setEditingMode(true);
  };

  drawEditIcon(toDraw: boolean) {
    return toDraw ? (
      <div
        className="table__session-edit"
        onClick={this.onEditButtonClick}
      />
    ) : null;
  }

  onEditComplete = () => {
    this.setEditingMode(false);
  };

  drawDuration(session: TableSessionType) {
    const {adminEdited, isInPending, durationSeconds, id} = session;
    const durationData = Component.getSessionDurationData(durationSeconds);
    const {hours, minutes, minutesTotal} = durationData;

    if (this.state.isInEditing) {
      return (
        <div className="table__session-length-edit">
          <SessionEditBlock
            durationSeconds={durationSeconds}
            sessionId={id}
            onEditComplete={this.onEditComplete}
          />
        </div>
      );
    } else {
      const adminEditedClassName = adminEdited ? 'table__session-length_admin-edited' : '';
      const durationString = isInPending ?
        'wait...' : Component.getDurationString(hours, minutes, minutesTotal, this.state.isFormatOfMinutes);

      return (
        <span
            className={`table__session-length ${adminEditedClassName}`}
            onClick={this.onSessionInfoClick}
        >
          {durationString}
        </span>
      );
    }
  };

  render() {
    const {session} = this.props;

    if (session) {
      const {durationSeconds, startsAt} = session;
      const finishTime = moment.utc(startsAt)
        .add({
          seconds: durationSeconds
        })
        .format('hh:mm');

      return (
        <div className="table__session-info table__session-info_state_editing">
          <span className="table__session-name">Last Session</span>
          <span className="table__session-finish-time">{finishTime}</span>
          {this.drawDuration(session)}
          {this.drawEditIcon(this.props.inAdminMode && !this.state.isInEditing)}
        </div>
      );
    } else {
      return (
        <div className="table__session-info">
          <div className="table__label table__label_role_no-session">No Sessions Today</div>
        </div>
      );
    }
  }
}

const TableSession = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    const tableSessions = state.app.tableSessionsData.tableSessions;
    const sessionId = ownProps.sessionId;

    return {
      inAdminMode: !!state.app.adminToken,
      session: typeof sessionId === 'number' ? tableSessions[sessionId] : null
    };
  }
)(Component);

export default TableSession;
