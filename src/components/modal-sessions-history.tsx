import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import * as Modal from 'react-modal';
import {find} from 'lodash';

import {StoreStructure, Table, TableSession} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import modalSessionsHistoryChanged from '../action-creators/modal-sessions-history-changed';
import SessionsHistory from './sessions-history';

interface Props {
}

interface MappedProps {
  isOpen: boolean;
  tableId?: number;
  tables: Table[];
  allTableSessions: TableSession[];
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {

  static getElementById<T extends { id: number }> (array: T[], id?: number) {
    return find(array, (el: T) => {
      return el.id === id;
    });
  };

  static getSessionsHistoryInPending(currentTable?: Table) {
    return currentTable ? currentTable.isSessionsHistoryInPending : false;
  }

  requestToClose = () => {
    this.props.dispatch( modalSessionsHistoryChanged(false) );
  };

  onCloseClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.requestToClose();
  };

  handleRequestCloseFunc = () => {
    this.requestToClose();
  };

  static getTableSessions(allSessions: TableSession[], table?: Table) {
    if (table) {
      return table.sessionsHistory.reduce((memoArr: TableSession[], id) => {
        const session = Component.getElementById<TableSession>(allSessions, id);

        return memoArr.concat(session ? [session] : []);
      }, [] as TableSession[]);
    } else {
      return;
    }
  };

  render() {
    const currentTable = Component.getElementById<Table>(this.props.tables, this.props.tableId);
    const historyPending = Component.getSessionsHistoryInPending(currentTable);
    const sessions = Component.getTableSessions(this.props.allTableSessions, currentTable);

    return (
      <Modal
        contentLabel="Sessions History"
        isOpen={this.props.isOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={this.handleRequestCloseFunc}
      >
        <a href=""
           onClick={this.onCloseClick}
        >
          close
        </a>

        <SessionsHistory
          isInPending={historyPending}
          tableSessions={sessions}
        />

      </Modal>
    );
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
