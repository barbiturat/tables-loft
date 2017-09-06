import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import * as R from 'ramda';

import { StoreStructure, TableSessionStore } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import SessionEditBlock from './session-edit-block';

interface Props {
  readonly sessionId?: number;
}

interface MappedProps {
  readonly inAdminMode: boolean;
  readonly session: TableSessionStore | null;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

type InnerProps = PropsFromConnect & {
  readonly setEditSessionButtonId: (val: string) => void;
  readonly setThisInstance: (val: React.ReactInstance | null) => void;
  readonly setInEditing: (val: boolean) => void;
  readonly handleClick: (val: Event) => void;
};

interface SessionDurationData {
  readonly hours: number;
  readonly minutes: number;
  readonly minutesTotal: number;
}

const getDurationPart = R.converge(R.compose, [R.always(Math.floor), R.invoker(0)]);

const getAdminEditedClassName: (session: TableSessionStore) => string = R.ifElse(
  R.compose(Boolean, R.prop('adminEdited')),
  R.always('table__session-length_admin-edited'),
  R.always('')
);

const getSessionDurationData: (val: number) => SessionDurationData = R.compose(
  R.applySpec<SessionDurationData>({
    hours: getDurationPart('asHours'),
    minutes: getDurationPart('minutes'),
    minutesTotal: getDurationPart('asMinutes')
  }),
  moment.duration,
  R.objOf<string>('seconds')
);

const drawWrappedSessionEditBlock = ({durationSeconds, id}: TableSessionStore, onEditComplete: () => void) =>
  <div className="table__session-length-edit">
    <SessionEditBlock
      durationSeconds={durationSeconds}
      sessionId={id}
      onEditComplete={onEditComplete}
    />
  </div>;

const getDurationString = (
  hours: number,
  minutes: number,
  minutesTotal: number,
  isFormatOfMinutes: boolean
): string =>
  isFormatOfMinutes
    ? `${minutesTotal}m`
    : moment
        .utc({
          hours,
          minutes
        })
        .format('H[h] mm[m]');

const enhance = compose(
  withState('editSessionButtonId', 'setEditSessionButtonId', ''),
  withState('isFormatOfMinutes', 'setFormatOfMinutes', false),
  withState('isInEditing', 'setInEditing', false),
  withState('thisInstance', 'setThisInstance', null),
  withHandlers({
    onClickOutside: ({ setInEditing }) => () => setInEditing(false),
    onSessionInfoClick: ({ setFormatOfMinutes, isFormatOfMinutes }) => () =>
      setFormatOfMinutes(!isFormatOfMinutes),
    onEditButtonClick: ({ setInEditing }) => () => setInEditing(true),
    onEditComplete: ({ setInEditing }) => () => setInEditing(false)
  }),
  withHandlers({
    handleClick: ({ onClickOutside, thisInstance, editSessionButtonId }) => (event: Event) => {
      const isClickedOutside = ({ target }: any) =>
        !ReactDOM.findDOMNode(thisInstance! as React.ReactInstance).contains(target) &&
        !target.classList.contains(editSessionButtonId);

      R.when(isClickedOutside, onClickOutside)(event);
    },
    drawEditIcon: ({ editSessionButtonId, onEditButtonClick, inAdminMode, isInEditing }) => () => {
      return inAdminMode && !isInEditing
        ? <div
            className={`table__session-edit ${editSessionButtonId}`}
            onClick={onEditButtonClick}
          />
        : null;
    },
    drawDuration: ({ isInEditing, onEditComplete, isFormatOfMinutes, onSessionInfoClick }) => () => (
      session: TableSessionStore
    ) => {
      if (isInEditing) {
        return drawWrappedSessionEditBlock(session, onEditComplete);
      } else {
        const generateDurationString: (session: TableSessionStore) => string = R.compose(
          R.apply(getDurationString),
          R.append(isFormatOfMinutes),
          R.props(['hours', 'minutes', 'minutesTotal']),
          getSessionDurationData,
          R.prop('durationSeconds')
        );
        const getDurationInfoString: (session: TableSessionStore) => string = R.ifElse(
          R.compose(Boolean, R.prop('isInPending')),
          R.always('wait...'),
          generateDurationString
        );

        return (
          <span
            className={`table__session-length ${getAdminEditedClassName(session)}`}
            onClick={onSessionInfoClick}
          >
            {getDurationInfoString(session)}
          </span>
        );
      }
    }
  }),
  lifecycle<InnerProps, {}>({
    componentWillMount() {
      this.props.setEditSessionButtonId('editSessionButton' + Math.floor(Math.random() * 10000000));
      this.props.setThisInstance(this as React.ReactInstance);
      window.addEventListener('click', this.props.handleClick, false);
    },
    componentWillUnmount() {
      window.removeEventListener('click', this.props.handleClick, false);
    }
  })
);

const Component = enhance(
  ({ session, drawDuration, drawEditIcon }: any) => {
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
          {drawDuration()}
          {drawEditIcon()}
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
