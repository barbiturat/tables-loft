import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import KeyboardEvent = React.KeyboardEvent;
import * as moment from 'moment';
import {merge} from 'ramda';

import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import requestingTableSessionChange from '../action-creators/requesting-table-session-change';
import EventHandler = React.EventHandler;
import FocusEvent = React.FocusEvent;

interface SessionDurationData {
  hours: number;
  minutes: number;
}

interface Props {
  durationSeconds: number;
  sessionId: number;
  onEditComplete: () => void;
}

interface State {
  hours: number;
  minutes: number;
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {

  constructor(props: Props) {
    super(props);

    const durationData = Component.getSessionDurationData(props.durationSeconds);

    this.state = {
      hours: durationData.hours,
      minutes: durationData.minutes
    };
  }

  componentWillReceiveProps(nextProps: PropsFromConnect) {
    if (nextProps.durationSeconds !== this.props.durationSeconds) {
      const durationData = Component.getSessionDurationData(nextProps.durationSeconds);
      const {hours, minutes} = durationData;

      this.setState({
        hours,
        minutes
      })
    }
  }

  onInputChange = (event: KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    if (input.name === 'hours') {
      this.setEditingHours( Number(input.value) );
    }
    if (input.name === 'minutes') {
      this.setEditingMinutes( Number(input.value) );
    }
  };

  onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const {dispatch, sessionId, onEditComplete} = this.props;

    if (typeof sessionId !== 'number') {
      return;
    }

    const isEsc = event.keyCode === 27;
    const isEnter = event.keyCode === 13;

    if (isEsc || isEnter) {
      event.preventDefault();
    }

    if (isEnter) {
      const duration = moment.duration({
        hours: this.state.hours,
        minutes: this.state.minutes
      });
      const newSeconds = duration.asSeconds();
      const action = requestingTableSessionChange(sessionId, newSeconds);

      dispatch(action);
      onEditComplete();
      return;
    }

    if (isEsc) {
      onEditComplete();
    }
  };

  setEditingHours(hours: number) {
    this.setState(merge(this.state, {
      hours: hours
    }));
  }

  setEditingMinutes(minutes: number) {
    this.setState(merge(this.state, {
      minutes: minutes
    }));
  }

  static getSessionDurationData(durationSeconds: number): SessionDurationData {
    const duration = moment.duration({seconds: durationSeconds});

    return {
      hours: Math.floor( duration.asHours() ),
      minutes: Math.floor( duration.minutes() ),
    };
  }

  render() {
    const hr: string = String(this.state.hours);
    const min: string = String(this.state.minutes);

    return (
      <form className="table__session-length-edit-form">

        <label className="table__session-length-edit-label">
          <span className="table__session-length-edit-label-text">hr:</span>
          <span className="table__session-length-edit-input-container">
            <input
              name="hours"
              className="table__session-length-edit-input"
              defaultValue={hr}
              onChange={this.onInputChange}
              onKeyDown={this.onInputKeyDown}
            />
          </span>
        </label>

        <label className="table__session-length-edit-label">
          <span className="table__session-length-edit-label-text">min:</span>
          <span className="table__session-length-edit-input-container">
            <input
              name="minutes"
              className="table__session-length-edit-input"
              defaultValue={min}
              onChange={this.onInputChange}
              onKeyDown={this.onInputKeyDown}
            />
          </span>
        </label>

      </form>

    );
  }
}

const SessionEditBlock = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
    };
  }
)(Component);

export default SessionEditBlock;
