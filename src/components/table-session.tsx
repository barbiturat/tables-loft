import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;
import KeyboardEvent = React.KeyboardEvent;
import {assign} from 'lodash';

import {StoreStructure, TableSession as TableSessionType, AdminToken, TableSessions} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import requestingTableSessionChange from '../action-creators/requesting-table-session-change';

interface Props {
  sessionId?: number;
}

interface State {
  isFormatOfMinutes: boolean;
  isInEditing: boolean;
}

interface MappedProps {
  adminToken: AdminToken;
  sessions: TableSessions;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isFormatOfMinutes: false,
      isInEditing: false
    };
  }

  setEditingMode(turnOn: boolean) {
    this.setState(assign({}, this.state, {
      isInEditing: turnOn
    }));
  }

  onSessionInfoClick = (event: MouseEvent<HTMLDivElement>) => {
    this.setState(assign({}, this.state, {
      isFormatOfMinutes: !this.state.isFormatOfMinutes
    }));
  };

  static getDurationString(durationSeconds: number, isFormatOfMinutes: boolean): string {
    const duration = moment.duration({seconds: durationSeconds});

    if (isFormatOfMinutes) {
      const minutes = Math.floor( duration.asMinutes() );

      return `${minutes}m`;
    } else {
      return moment.utc({
        hours: duration.hours(),
        minutes: duration.minutes()
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

  onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const {sessionId, dispatch, adminToken, sessions} = this.props;

    if (typeof sessionId !== 'number') {
      return;
    }

    const session = sessions[sessionId];
    const input = event.currentTarget;
    const isEsc = event.keyCode === 27;
    const isEnter = event.keyCode === 13;

    if (isEsc || isEnter) {
      event.preventDefault();
    }

    if (isEnter && adminToken && session) {
      const {id} = session;
      const newMinutes = Number(input.value);
      const duration = moment.duration({minutes: newMinutes});
      const newSeconds = duration.asSeconds();
      const action = requestingTableSessionChange(id, newSeconds, adminToken);

      dispatch(action);
      this.setEditingMode(false);
      return;
    }

    if (isEsc) {
      this.setEditingMode(false);
    }
  };

  drawDuration(session: TableSessionType, isFormatOfMinutes: boolean) {
    const {durationSeconds, adminEdited, isInPending} = session;

    if (this.state.isInEditing) {
      const duration = moment.duration({seconds: durationSeconds});
      const minutes = String( duration.asMinutes() );

      return (
        <div className="table__session-length-edit">
          <form className="table__session-length-edit-form">
            <label className="table__session-length-edit-label">
              <span className="table__session-length-edit-label-span">minutes:</span>
              <input
                className="table__session-length-edit-input"
                type="number"
                defaultValue={minutes}
                onKeyDown={this.onInputKeyDown}
              />
            </label>
          </form>
        </div>
      );
    } else {
      const adminEditedClassName = adminEdited ? 'table__session-length_admin-edited' : '';
      const durationString = isInPending ?
        'wait...' : Component.getDurationString(durationSeconds, isFormatOfMinutes);

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
    const {sessions, sessionId} = this.props;
    const session = typeof sessionId === 'number' ? sessions[sessionId] : null;

    if (session) {
      const {durationSeconds, startsAt} = session;
      const finishTime = moment.utc(startsAt)
        .add({
          seconds: durationSeconds
        })
        .format('hh:mm');

      return (
        <div className="table__session-info">
          <span className="table__session-name">Last Session</span>
          <span className="table__session-finish-time">{finishTime}</span>
          {this.drawDuration(session, this.state.isFormatOfMinutes)}
          {this.drawEditIcon(!!this.props.adminToken && !this.state.isInEditing)}
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
    return {
      adminToken: state.app.adminToken,
      sessions: state.app.tableSessionsData.tableSessions
    };
  }
)(Component);

export default TableSession;
