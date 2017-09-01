import * as React from 'react';
import { connect } from 'react-redux';
import KeyboardEvent = React.KeyboardEvent;
import * as moment from 'moment';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import * as R from 'ramda';

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

type InnerProps = Props & {
  readonly hours: number;
  readonly minutes: number;
  readonly setHours: (hours: number) => void;
  readonly setMinutes: (minutes: number) => void;
};

interface MappedProps {}

type PropsFromConnect = PropsExtendedByConnect<InnerProps, MappedProps>;

const getSessionDurationData: (durationSeconds: number) => SessionDurationData = R.memoize(
  (durationSeconds: number): SessionDurationData =>
    R.applySpec<SessionDurationData>({
      hours: R.compose(Math.floor, R.invoker(0, 'asHours')),
      minutes: R.compose(Math.floor, R.invoker(0, 'minutes'))
    })(moment.duration({ seconds: durationSeconds }))
);

const enhance = compose(
  withState(
    'hours',
    'setHours',
    ({ durationSeconds }) =>
      getSessionDurationData(durationSeconds).hours
  ),
  withState(
    'minutes',
    'setMinutes',
    ({ durationSeconds }) =>
      getSessionDurationData(durationSeconds).minutes
  ),
  withHandlers({
    onInputChange: ({ setHours, setMinutes }) => (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const nameEquals = R.useWith(R.call, [R.identical, R.prop('name')]);
      const setTimePart = R.useWith(R.call, [
        R.identity,
        R.compose(Number, R.prop('value'))
      ]);

      return R.cond([
        [nameEquals('hours'), setTimePart(setHours)],
        [nameEquals('minutes'), setTimePart(setMinutes)]
      ])(event.currentTarget);
    },
    onInputKeyDown: ({
      dispatch,
      sessionId,
      onEditComplete,
      hours,
      minutes
    }) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (typeof sessionId !== 'number') {
        return;
      }

      const isEsc = event.keyCode === 27;
      const isEnter = event.keyCode === 13;

      if (isEsc || isEnter) {
        event.preventDefault();
      }

      if (isEnter) {
        R.compose(
          dispatch,
          requestingTableSessionChange(sessionId),
          R.invoker(0, 'asSeconds'),
          moment.duration
        )({
          hours,
          minutes
        });

        onEditComplete();
        return;
      }

      if (isEsc) {
        onEditComplete();
      }
    }
  }),
  lifecycle<InnerProps, any>({
    componentWillReceiveProps(nextProps: PropsFromConnect) {
      const changeStates = R.converge(R.T, [
        R.compose(this.props.setHours, R.prop('hours')),
        R.compose(this.props.setMinutes, R.prop('minutes'))
      ]);
      const updateStates = R.compose(changeStates, getSessionDurationData);

      R.unless(R.identical(this.props.durationSeconds), updateStates)(
        nextProps.durationSeconds
      );
    }
  })
);

const Component = enhance(
  ({ hours, minutes, onInputChange, onInputKeyDown }: any) =>
    <form className="session-edit-block__form">
      <label className="session-edit-block__label">
        <span className="session-edit-block__text">hr:</span>
        <span className="session-edit-block__input-container">
          <input
            name="hours"
            className="session-edit-block__input"
            defaultValue={String(hours)}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
        </span>
      </label>

      <label className="session-edit-block__label">
        <span className="session-edit-block__text">min:</span>
        <span className="session-edit-block__input-container">
          <input
            name="minutes"
            className="session-edit-block__input"
            defaultValue={String(minutes)}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
        </span>
      </label>
    </form>
);

const SessionEditBlock = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {};
})(Component);

export default SessionEditBlock;
