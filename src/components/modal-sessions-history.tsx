import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import * as Modal from 'react-modal';

import {StoreStructure, Table, TableSession, Tables, TableSessions} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import modalSessionsHistoryChanged from '../action-creators/modal-sessions-history-changed';
import SessionsHistory from './sessions-history';

interface Props {
}

interface MappedProps {
  isOpen: boolean;
  tableId?: number;
  tables: Tables;
  allTableSessions: TableSessions;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {

  static getSessionsHistoryInPending(currentTable?: Table) {
    return currentTable ? currentTable.isSessionsHistoryInPending : false;
  }

  requestToClose() {
    this.props.dispatch( modalSessionsHistoryChanged(false) );
  };

  onCloseClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.requestToClose();
  };

  handleRequestClose = () => {
    this.requestToClose();
  };

  static getTableSessions(allSessions: TableSessions, table: Table): TableSessions {
    return table.sessionsHistory.reduce((memo: TableSession[], id) => {
      const session = allSessions[id];

      if (session) {
        memo[session.id] = session;
      }

      return memo;
    }, {} as TableSessions);
  };

  render() {
    const {tables, tableId, allTableSessions} = this.props;

    if (tableId) {
      const currentTable = tables[tableId];
      const historyPending = Component.getSessionsHistoryInPending(currentTable);
      let sessions;

      if (currentTable) {
        sessions = Component.getTableSessions(allTableSessions, currentTable);
      }

      return (
        <Modal
          contentLabel="Sessions History"
          isOpen={this.props.isOpen}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleRequestClose}
          className="modal modal_role_sessions-history"
          overlayClassName="modal__overlay"
        >
          <a className="modal__button-close" href=""
             onClick={this.onCloseClick}
          />
          <div className="modal__header">
            <h3 className="modal__header-caption">Shuffle board 6</h3>
            <h4 className="modal__header-sub-caption">History Today</h4>
          </div>

          <SessionsHistory
            isInPending={historyPending}
            tableSessions={sessions}
          />

        </Modal>
      );
    } else {
      return null;
    }
  }
}

const ModalSessionsHistory = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      isOpen: state.app.modals.modalSessionsHistory.isOpened,
      tableId: state.app.modals.modalSessionsHistory.tableId,
      tables: state.app.tablesData.tables,
      allTableSessions: state.app.tableSessionsData.tableSessions
    };
  }
)(Component);

export default ModalSessionsHistory;
