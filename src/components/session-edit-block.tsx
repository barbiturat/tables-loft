import * as React from 'react';
import { connect } from 'react-redux';
import KeyboardEvent = React.KeyboardEvent;
import * as moment from 'moment';

import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import requestingTableSessionChange from '../action-creators/requesting-table-session-change';
import ChangeEvent = React.ChangeEvent;

interface SessionDurationData {
  readonly hours: number;
  readonly minutes: number;
}

interface Props {
  readonly durationSeconds: number;
  readonly sessionId: number;
  readonly onEditComplete: () => void;
}

interface State {
  readonly hours: number;
  readonly minutes: number;
}

interface MappedProps {}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const getSessionDurationData = (
  durationSeconds: number
): SessionDurationData => {
  const duration = moment.duration({ seconds: durationSeconds });

  return {
    hours: Math.floor(duration.asHours()),
    minutes: Math.floor(duration.minutes())
  };
};

class Component extends React.Component<PropsFromConnect, State> {
  constructor(props: PropsFromConnect) {
    super(props);

    const durationData = getSessionDurationData(props.durationSeconds);

    this.state = {
      hours: durationData.hours,
      minutes: durationData.minutes
    };
  }

  componentWillReceiveProps(nextProps: PropsFromConnect) {
    if (nextProps.durationSeconds !== this.props.durationSeconds) {
      const durationData = getSessionDurationData(nextProps.durationSeconds);
      const { hours, minutes } = durationData;

      this.setState({
        hours,
        minutes
      });
    }
  }

  onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    if (input.name === 'hours') {
      this.setEditingHours(Number(input.value));
    }
    if (input.name === 'minutes') {
      this.setEditingMinutes(Number(input.value));
    }
  };

  onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { dispatch, sessionId, onEditComplete } = this.props;

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
    this.setState({
      ...this.state,
      ...{
        hours: hours
      }
    });
  }

  setEditingMinutes(minutes: number) {
    this.setState({
      ...this.state,
      ...{
        minutes: minutes
      }
    });
  }

  render() {
    const hr: string = String(this.state.hours);
    const min: string = String(this.state.minutes);

    return (
      <form className="session-edit-block__form">
        <label className="session-edit-block__label">
          <span className="session-edit-block__text">hr:</span>
          <span className="session-edit-block__input-container">
            <input
              name="hours"
              className="session-edit-block__input"
              defaultValue={hr}
              onChange={this.onInputChange}
              onKeyDown={this.onInputKeyDown}
            />
          </span>
        </label>

        <label className="session-edit-block__label">
          <span className="session-edit-block__text">min:</span>
          <span className="session-edit-block__input-container">
            <input
              name="minutes"
              className="session-edit-block__input"
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

const SessionEditBlock = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {};
})(Component);

export default SessionEditBlock;
