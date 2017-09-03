import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import * as R from 'ramda';

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
  readonly thisInstance?: React.ReactInstance | null;
}

interface MappedProps {
  readonly inAdminMode: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

type InnerProps = PropsFromConnect & {
  readonly isFormatOfMinutes: boolean;
  readonly isInEditing: boolean;
  readonly editSessionButtonId: string;
  readonly setThisInstance: (val: React.ReactInstance | null) => void;
  readonly setFormatOfMinutes: (val: boolean) => void;
  readonly setInEditing: (val: boolean) => void;
  readonly setEditSessionButtonId: (val: string) => void;
  readonly handleClick: () => void;
  readonly onSessionInfoClick: React.MouseEventHandler<any>;
  readonly drawDuration: (session: TableSessionStore) => React.ReactNode;
  readonly drawEditButton: (toDraw: boolean) => void;
};

const getDurationPart = R.converge(R.compose, [R.always(Math.floor), R.invoker(0)]);

const getSessionDurationData = (durationSeconds: number): SessionDurationData => {
  const _getSessionDurationData = R.applySpec<SessionDurationData>({
    hours: getDurationPart('asHours'),
    minutes: getDurationPart('minutes'),
    minutesTotal: getDurationPart('asMinutes')
  });

  return R.compose(_getSessionDurationData, moment.duration)({
    seconds: durationSeconds
  });
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

const enhance = compose(
  withState('thisInstance', 'setThisInstance', null),
  withState('isFormatOfMinutes', 'setFormatOfMinutes', false),
  withState('isInEditing', 'setInEditing', false),
  withState('editSessionButtonId', 'setEditSessionButtonId', ''),
  withHandlers({
    onSessionInfoClick: ({ setFormatOfMinutes, isFormatOfMinutes }) => () =>
      setFormatOfMinutes(!isFormatOfMinutes)
  }),
  withHandlers({
    onClickOutside: ({ setInEditing }) => () => setInEditing(false),
    onEditButtonClick: ({ setInEditing }) => () => setInEditing(true),
    onEditComplete: ({ setInEditing }) => () => setInEditing(false)
  }),
  withHandlers({
    handleClick: ({ thisInstance, editSessionButtonId, onClickOutside }) => (event: Event) => {
      const isClickedNotOnThis = (clickedEl: HTMLElement) =>
        !ReactDOM.findDOMNode(thisInstance as React.ReactInstance).contains(clickedEl);
      const isClickedNotOnEditButton = (clickedEl: HTMLElement) =>
        !clickedEl.classList.contains(editSessionButtonId);
      const isClickedOutside = R.both(isClickedNotOnThis, isClickedNotOnEditButton);

      R.when(isClickedOutside, onClickOutside)(event.target);
    },
    drawEditButton: ({ editSessionButtonId, onEditButtonClick }) => (toDraw: boolean) => {
      return toDraw
        ? <div
            className={`sessions-list__edit-button ${editSessionButtonId}`}
            onClick={onEditButtonClick}
          />
        : null;
    },
    drawDuration: ({ isInEditing, onEditComplete, isFormatOfMinutes, onSessionInfoClick }) => (
      session: TableSessionStore
    ) => {
      const { durationSeconds, id } = session;
      const durationData = getSessionDurationData(durationSeconds);
      const { hours, minutes, minutesTotal } = durationData;

      if (isInEditing) {
        return (
          <SessionEditBlock
            durationSeconds={durationSeconds}
            sessionId={id}
            onEditComplete={onEditComplete}
          />
        );
      } else {
        const getAdminEditedClassName = R.ifElse(
          R.compose(Boolean, R.prop('adminEdited')),
          R.always('table__session-length_admin-edited'),
          R.always('')
        );
        const _getDurationString = R.partial(getDurationString, [
          hours,
          minutes,
          minutesTotal,
          isFormatOfMinutes
        ]);
        const getDurationTimeString = R.ifElse(
          R.compose(Boolean, R.prop('isInPending')),
          R.always('wait...'),
          _getDurationString
        );

        return (
          <span
            className={`table__session-length ${getAdminEditedClassName(session)}`}
            onClick={onSessionInfoClick}
          >
            {getDurationTimeString(session)}
          </span>
        );
      }
    }
  }),
  lifecycle<InnerProps, {}>({
    componentWillMount() {
      this.props.setThisInstance(this as React.ReactInstance);
      this.props.setEditSessionButtonId('editSessionButton' + Math.floor(Math.random() * 10000000));

      window.addEventListener('click', this.props.handleClick, false);
    },
    componentWillUnmount() {
      window.removeEventListener('click', this.props.handleClick, false);
    }
  })
);

const Component = enhance(
  ({
    session,
    onSessionInfoClick,
    drawDuration,
    drawEditButton,
    inAdminMode,
    isInEditing
  }: InnerProps) => {
    if (session) {
      const getFinishTimeStr = ({ durationSeconds, startsAt }: TableSessionStore) =>
        moment
          .utc(startsAt)
          .add({
            seconds: durationSeconds
          })
          .format('hh:mm');

      return (
        <div className="sessions-list__tr">
          <div className="sessions-list__td sessions-list__td_role_time">
            {getFinishTimeStr(session)}
          </div>
          <div className="sessions-list__td sessions-list__td_role_duration">
            <div className="sessions-list__text" onClick={onSessionInfoClick}>
              {drawDuration(session)}
            </div>
            {drawEditButton(inAdminMode && !isInEditing)}
          </div>
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
);

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
