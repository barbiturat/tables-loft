import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import * as Modal from 'react-modal';
import * as ReactPaginate from 'react-paginate';

import {StoreStructure, Table, TableSession, Tables, TableSessions} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import modalSessionsHistoryChanged from '../action-creators/modal-sessions-history-changed';
import SessionsHistory from './sessions-history';

interface Props {
}

interface MappedProps {
  isOpen: boolean;
  tables: Tables;
  currentTable?: Table;
  allTableSessions: TableSessions;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {

  static modalClasses = {
    pool: 'modal_table_pool',
    shuffleBoard: 'modal_table_shuffle',
    tableTennis: 'modal_table_tennis',
    generic: 'modal_table_default'
  };


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
    const {allTableSessions, currentTable} = this.props;

    if (currentTable) {
      const historyPending = Component.getSessionsHistoryInPending(currentTable);
      const sessions = Component.getTableSessions(allTableSessions, currentTable);
      const modalClass = Component.modalClasses[currentTable.tableType] || '';
      const caption = currentTable.name;

      return (
        <Modal
          contentLabel="Sessions History"
          isOpen={this.props.isOpen}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleRequestClose}
          className={`modal modal_role_sessions-history ${modalClass}`}
          overlayClassName="modal__overlay"
        >
          <a className="modal__button-close" href=""
             onClick={this.onCloseClick}
          />
          <div className="modal__header">
            <h3 className="modal__header-caption">{caption}</h3>
            <h4 className="modal__header-sub-caption">History Today</h4>
          </div>

          <SessionsHistory
            isInPending={historyPending}
            tableSessions={sessions}
          />

          <ReactPaginate
            pageCount={15}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            initialPage={7}
            previousLabel="previous"
            nextLabel="next"
            breakLabel={<a href="">...</a>}
            breakClassName="break-me"
            containerClassName="paginator"
            pageClassName="paginator__button paginator__button_role_page"
            previousClassName="paginator__button paginator__button_role_prev"
            nextClassName="paginator__button paginator__button_role_next"
            activeClassName="active"
            disabledClassName="disabled"
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
    const appData = state.app;
    const modalData = appData.modals.modalSessionsHistory;
    const tables = appData.tablesData.tables;
    const tableId = modalData.tableId;
    let currentTable;

    if (tableId) {
      currentTable = tables[tableId];
    }

    return {
      isOpen: modalData.isOpened,
      tables,
      currentTable,
      allTableSessions: appData.tableSessionsData.tableSessions
    };
  }
)(Component);

export default ModalSessionsHistory;
