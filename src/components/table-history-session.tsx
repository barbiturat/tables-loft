import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;

import { StoreStructure, TableSessionStore } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import SessionEditBlock from './session-edit-block';

interface SessionDurationData {
  readonly hours: number;
  readonly minutes: number;
  readonly minutesTotal: number;
}

interface Props {
  readonly session: TableSessionStore;
  readonly idx: number;
}

interface State {
  readonly isFormatOfMinutes: boolean;
  readonly isInEditing: boolean;
}

interface MappedProps {
  readonly inAdminMode: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const getSessionDurationData = (
  durationSeconds: number
): SessionDurationData => {
  const duration = moment.duration({ seconds: durationSeconds });

  return {
    hours: Math.floor(duration.asHours()),
    minutes: Math.floor(duration.minutes()),
    minutesTotal: Math.floor(duration.asMinutes())
  };
};

const getDurationString = (
  hours: number,
  minutes: number,
  minutesTotal: number,
  isFormatOfMinutes: boolean
): string => {
  if (isFormatOfMinutes) {
    return `${minutesTotal}m`;
  } else {
    return moment
      .utc({
        hours,
        minutes
      })
      .format('H[h] mm[m]');
  }
};

class Component extends React.Component<PropsFromConnect, State> {
  editSessionButtonId: string;

  constructor(props: PropsFromConnect) {
    super(props);

    this.editSessionButtonId =
      'editSessionButton' + Math.floor(Math.random() * 10000000);

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

  componentWillMount() {
    window.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, false);
  }

  handleClick = (event: any) => {
    const clickedEl = event.target;
    const isClickedOutside =
      !ReactDOM.findDOMNode(this).contains(clickedEl) &&
      !clickedEl.classList.contains(this.editSessionButtonId);

    if (isClickedOutside) {
      this.onClickOutside();
    }
  };

  onClickOutside = () => {
    this.setEditingMode(false);
  };

  onSessionInfoClick = (event: MouseEvent<HTMLDivElement>) => {
    this.setState({
      ...this.state,
      ...{
        isFormatOfMinutes: !this.state.isFormatOfMinutes
      }
    });
  };

  setEditingMode(turnOn: boolean) {
    this.setState({
      ...this.state,
      ...{
        isInEditing: turnOn
      }
    });
  }

  onEditButtonClick = (event: MouseEvent<HTMLDivElement>) => {
    this.setEditingMode(true);
  };

  onEditComplete = () => {
    this.setEditingMode(false);
  };

  drawEditButton(toDraw: boolean) {
    return toDraw
      ? <div
          className={`sessions-list__edit-button ${this.editSessionButtonId}`}
          onClick={this.onEditButtonClick}
        />
      : null;
  }

  drawDuration(session: TableSessionStore) {
    const { adminEdited, isInPending, durationSeconds, id } = session;
    const durationData = getSessionDurationData(durationSeconds);
    const { hours, minutes, minutesTotal } = durationData;

    if (this.state.isInEditing) {
      return (
        <SessionEditBlock
          durationSeconds={durationSeconds}
          sessionId={id}
          onEditComplete={this.onEditComplete}
        />
      );
    } else {
      const adminEditedClassName = adminEdited
        ? 'table__session-length_admin-edited'
        : '';
      const durationString = isInPending
        ? 'wait...'
        : getDurationString(
            hours,
            minutes,
            minutesTotal,
            this.state.isFormatOfMinutes
          );

      return (
        <span
          className={`table__session-length ${adminEditedClassName}`}
          onClick={this.onSessionInfoClick}
        >
          {durationString}
        </span>
      );
    }
  }

  render() {
    const { session } = this.props;

    if (session) {
      const { durationSeconds, startsAt } = session;
      const finishTime = moment
        .utc(startsAt)
        .add({
          seconds: durationSeconds
        })
        .format('hh:mm');

      return (
        <div className="sessions-list__tr">
          <div className="sessions-list__td sessions-list__td_role_time">
            {finishTime}
          </div>
          <div className="sessions-list__td sessions-list__td_role_duration">
            <div
              className="sessions-list__text"
              onClick={this.onSessionInfoClick}
            >
              {this.drawDuration(this.props.session)}
            </div>
            {this.drawEditButton(
              this.props.inAdminMode && !this.state.isInEditing
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="table__session-info">
          <div className="table__label table__label_role_no-session">
            No Sessions Today
          </div>
        </div>
      );
    }
  }
}

const TableHistorySession = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {
    inAdminMode: !!state.app.adminToken
  };
})(Component);

export default TableHistorySession;
