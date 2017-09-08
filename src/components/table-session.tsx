import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';

import { StoreStructure, TableSessionStore } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import SessionEditBlock from './session-edit-block';
import { compose, lifecycle, withHandlers, withState } from 'recompose';

interface Props {
  readonly sessionId?: number;
}

interface MappedProps {
  readonly inAdminMode: boolean;
  readonly session: TableSessionStore | null;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

type InnerProps = PropsFromConnect & {
  readonly setEditSessionButtonId: any;
  readonly setThisInstance: any;
  readonly handleClick: any;
};

interface SessionDurationData {
  readonly hours: number;
  readonly minutes: number;
  readonly minutesTotal: number;
}

const getSessionDurationData = (durationSeconds: number): SessionDurationData => {
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

const drawEditIcon = (editSessionButtonId: React.EventHandler<any>, onEditButtonClick: React.EventHandler<any>, toDraw: boolean) => {
  return toDraw
    ? <div
      className={`table__session-edit ${editSessionButtonId}`}
      onClick={onEditButtonClick}
    />
    : null;
};

const drawDuration = (isInEditing: boolean, onEditComplete: any, isFormatOfMinutes: boolean, onSessionInfoClick: React.EventHandler<any>, session: TableSessionStore) => {
  const { adminEdited, isInPending, durationSeconds, id } = session;
  const durationData = getSessionDurationData(durationSeconds);
  const { hours, minutes, minutesTotal } = durationData;

  if (isInEditing) {
    return (
      <div className="table__session-length-edit">
        <SessionEditBlock
          durationSeconds={durationSeconds}
          sessionId={id}
          onEditComplete={onEditComplete}
        />
      </div>
    );
  } else {
    const adminEditedClassName = adminEdited ? 'table__session-length_admin-edited' : '';
    const durationString = isInPending
      ? 'wait...'
      : getDurationString(hours, minutes, minutesTotal, isFormatOfMinutes);

    return (
      <span
        className={`table__session-length ${adminEditedClassName}`}
        onClick={onSessionInfoClick}
      >
            {durationString}
          </span>
    );
  }
};

const enhance = compose(
  withState('editSessionButtonId', 'setEditSessionButtonId', ''),
  withState('isFormatOfMinutes', 'setIsFormatOfMinutes', false),
  withState('isInEditing', 'setIsInEditing', false),
  withState('thisInstance', 'setThisInstance', null),
  withHandlers({
    onSessionInfoClick: ({ isFormatOfMinutes, setIsFormatOfMinutes }) => () =>
      setIsFormatOfMinutes(!isFormatOfMinutes),
    onEditButtonClick: ({ setIsInEditing }) => () => setIsInEditing(true),
    onEditComplete: ({ setIsInEditing }) => () => setIsInEditing(false)
  }),
  withHandlers({
    handleClick: ({ onEditComplete, thisInstance, editSessionButtonId }) => (event: any) => {
      const clickedEl = event.target;
      const isClickedOutside =
        !ReactDOM.findDOMNode(thisInstance! as React.ReactInstance).contains(clickedEl) &&
        !clickedEl.classList.contains(editSessionButtonId);

      if (isClickedOutside) {
        onEditComplete();
      }
    },
  }),
  lifecycle<InnerProps, {}>({
    componentWillMount() {
      this.props.setEditSessionButtonId('editSessionButton' + Math.floor(Math.random() * 10000000));
      this.props.setThisInstance(this);
      window.addEventListener('click', this.props.handleClick, false);
    },
    componentWillUnmount() {
      window.removeEventListener('click', this.props.handleClick, false);
    }
  })
);

const Component = enhance(
  ({ session, inAdminMode, isInEditing, editSessionButtonId, onEditButtonClick, onEditComplete, isFormatOfMinutes, onSessionInfoClick }: any) => {
    if (session) {
      const { durationSeconds, startsAt } = session;
      const finishTime = moment
        .utc(startsAt)
        .add({
          seconds: durationSeconds
        })
        .format('hh:mm');

      return (
        <div className="table__session-info table__session-info_state_editing">
          <span className="table__session-name">Last Session</span>
          <span className="table__session-finish-time">
            {finishTime}
          </span>
          {drawDuration(isInEditing, onEditComplete, isFormatOfMinutes, onSessionInfoClick, session)}
          {drawEditIcon(editSessionButtonId, onEditButtonClick, inAdminMode && !isInEditing)}
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

const TableSession = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  const tableSessions = state.app.tableSessionsData.tableSessions;
  const sessionId = ownProps.sessionId;

  return {
    inAdminMode: !!state.app.adminToken,
    session: typeof sessionId === 'number' ? tableSessions[sessionId] : null
  };
})(Component);

export default TableSession;
