import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import * as Modal from 'react-modal';
import * as ReactPaginate from 'react-paginate';
import {pick, splitEvery, nth, pipe, keys} from 'ramda';

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

interface State {
  currentPageNum: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {

  static PAGE_SIZE = 5;

  static modalClasses = {
    pool: 'modal_table_pool',
    shuffleBoard: 'modal_table_shuffle',
    tableTennis: 'modal_table_tennis',
    generic: 'modal_table_default'
  };

  static getSessionsHistoryInPending(currentTable?: Table) {
    return currentTable ? currentTable.isSessionsHistoryInPending : false;
  }

  state = {
    currentPageNum: 0
  };

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

  static getSessionsPage(sessions: TableSessions, pageIdx: number): TableSessions {
    const idsPage = pipe<TableSessions, string[], string[][], string[]>(
      keys,
      splitEvery(Component.PAGE_SIZE),
      nth(pageIdx)
    )(sessions);

    if (idsPage) {
      return pick(idsPage)(sessions) as TableSessions;
    } else {
      return {} as TableSessions;
    }
  }

  onPageChangeHandler = (data: any) => {
    this.setState({
      currentPageNum: data.selected
    });
  };

  getPaginator(numOfPages: number, currentPageNum: number, isInPending: boolean) {
    return numOfPages && !isInPending ? (
        <ReactPaginate
          pageCount={numOfPages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={0}
          initialPage={0}
          forcePage={currentPageNum}
          previousLabel="previous"
          nextLabel="next"
          breakLabel={<span>...</span>}
          containerClassName="paginator"
          pageClassName="paginator__button paginator__button_role_page"
          pageLinkClassName="paginator__button-link"
          previousClassName="paginator__button paginator__button_role_prev"
          previousLinkClassName="paginator__button-link"
          nextClassName="paginator__button paginator__button_role_next"
          nextLinkClassName="paginator__button-link"
          breakClassName="paginator__button paginator__button_role_break"
          activeClassName="paginator-active"
          disabledClassName="paginator-disabled"
          onPageChange={this.onPageChangeHandler}
        />
      ) : null;
  }

  render() {
    const {allTableSessions, currentTable} = this.props;

    if (currentTable) {
      const currentPageNum = this.state.currentPageNum;
      const historyPending = Component.getSessionsHistoryInPending(currentTable);
      const modalClass = Component.modalClasses[currentTable.tableType] || '';
      const caption = currentTable.name;
      const sessions = Component.getTableSessions(allTableSessions, currentTable);
      const sessionCount = Object.keys(sessions).length;
      const sessionsPage = Component.getSessionsPage(sessions, currentPageNum);
      const numOfPages = Math.ceil( sessionCount / Component.PAGE_SIZE );
      const firstIdx = currentPageNum * Component.PAGE_SIZE;
      const showPaginator = sessionCount > Component.PAGE_SIZE;

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
            <h4 className="modal__header-sub-caption">Today's Sessions</h4>
          </div>

          <SessionsHistory
            isInPending={historyPending}
            tableSessions={sessionsPage}
            firstIdx={firstIdx}
          />

          { showPaginator && this.getPaginator(numOfPages, currentPageNum, historyPending) }
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
