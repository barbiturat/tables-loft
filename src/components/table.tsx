import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;

import TableSession from './table-session';
import { TableType } from '../interfaces/backend-models';
import {
  TableSession as TableSessionType,
  StoreStructure,
  TableSessions
} from '../interfaces/store-models';
import store from '../store/index';
import requestingTableStart from '../action-creators/requesting-table-start';
import requestingTableStop from '../action-creators/requesting-table-stop';
import { PropsExtendedByConnect } from '../interfaces/component';
import TableTimer from './table-timer';
import fetchingTableSessionsHistory from '../action-creators/fetching-table-sessions-history';
import modalSessionsHistoryChanged from '../action-creators/modal-sessions-history-changed';
import ModalPrompt from './modal-prompt';

interface State {
  readonly isPromptOpen: boolean;
  readonly promptMessage: string;
}

export interface Props {
  readonly id: number;
  readonly type?: TableType;
  readonly currentSessionId?: number;
  readonly lastSessionId?: number;
  readonly name?: string;
  readonly isInPending?: boolean;
  readonly isDisabled?: boolean;
}

interface MappedProps {
  readonly sessions: TableSessions;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {
  state = {
    isPromptOpen: false,
    promptMessage: ''
  };

  static defaultProps = {
    type: 'generic' as TableType,
    name: 'No Name',
    isInPending: false,
    isDisabled: false
  };

  static isTableActive(currentSession?: TableSessionType): boolean {
    return !!currentSession;
  }

  getCurrentSession() {
    const { sessions, currentSessionId } = this.props;

    if (currentSessionId) {
      return sessions[currentSessionId];
    }
    return;
  }

  static startsAtSelector(currentSession?: TableSessionType) {
    return currentSession && currentSession.startsAt;
  }

  static getDisabledLabel(isDisabled?: boolean) {
    return isDisabled
      ? <span className="table__label table__label_role_disabled">
          Pool Table 2 Is Not Active
        </span>
      : null;
  }

  static renderActiveSessionStartTime(currentSession?: TableSessionType) {
    if (!currentSession) {
      return null;
    } else {
      const startTime = moment
        .utc(currentSession.startsAt)
        .format('H[h] mm[m]');

      return (
        <div className="table__label table__label_role_start-time">
          {startTime}
        </div>
      );
    }
  }

  onPromptOk = () => {
    const { id, isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    const actionCreator = Component.isTableActive(this.getCurrentSession())
      ? requestingTableStop
      : requestingTableStart;
    const action = actionCreator(id);

    store.dispatch(action);
  };

  onPromptClose = () => {
    this.setState({
      ...this.state,
      ...{
        isPromptOpen: false
      }
    });
  };

  onChangeStatusClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // throw('test rollbar sourcemaps support');

    const toStop = Component.isTableActive(this.getCurrentSession());
    const promptMessage = `${toStop ? 'Stop' : 'Start'} table "${this.props
      .name}"`;

    this.setState({
      ...this.state,
      ...{
        isPromptOpen: true,
        promptMessage
      }
    });
  };

  onViewMoreClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch(fetchingTableSessionsHistory(this.props.id));
    this.props.dispatch(modalSessionsHistoryChanged(true, this.props.id));

    event.currentTarget.blur();
  };

  render() {
    const { name, type, isInPending, isDisabled } = this.props;
    const isActive = Component.isTableActive(this.getCurrentSession());
    const tableTypeClassName = type
      ? {
          pool: 'table_type_pool',
          shuffleBoard: 'table_type_shuffle',
          tableTennis: 'table_type_tennis',
          generic: 'table_type_default'
        }[type]
      : '';
    const statusClassName = isActive
      ? 'table_status_active'
      : 'table_status_ready';
    const pendingClassName = isInPending ? 'table_state_in-pending' : '';

    return (
      <div
        className={`table ${tableTypeClassName} ${statusClassName} ${pendingClassName} tables-set_adjust_table`}
      >
        {Component.getDisabledLabel(isDisabled)}
        <div className="table__label table__label_role_table-type">
          {name}
        </div>
        {isActive
          ? Component.renderActiveSessionStartTime(this.getCurrentSession())
          : ''}
        <a
          href=""
          className="table__button table__button_role_change-availability"
          onClick={this.onChangeStatusClick}
        />
        <TableTimer
          isActive={isActive}
          startsAt={Component.startsAtSelector(this.getCurrentSession())}
        />
        <TableSession sessionId={this.props.lastSessionId} />
        <a
          href=""
          className="table__btn-view-sessions"
          onClick={this.onViewMoreClick}
        >
          View More
        </a>

        <ModalPrompt
          isOpen={this.state.isPromptOpen}
          onClickOk={this.onPromptOk}
          onClose={this.onPromptClose}
          message={this.state.promptMessage}
        />
      </div>
    );
  }
}

const Table = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {
    sessions: state.app.tableSessionsData.tableSessions
  };
})(Component);

export default Table;
