import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import MouseEvent = React.MouseEvent;
import ReactModal from 'react-modal';
import * as ReactPaginate from 'react-paginate';
import {
  pipe,
  pick,
  splitEvery,
  nth,
  map,
  flip,
  sortBy,
  prop,
  values
} from 'ramda';

import {
  StoreStructure,
  TableStore,
  TableSessionStore,
  TablesStore,
  TableSessionsStore
} from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import modalSessionsHistoryChanged from '../action-creators/modal-sessions-history-changed';
import SessionsHistory from './sessions-history';
import { StringDict } from '../interfaces/index';

interface Props {}

interface MappedProps {
  readonly isOpen: boolean;
  readonly tables: TablesStore;
  readonly currentTable?: TableStore;
  readonly allTableSessions: TableSessionsStore;
}

interface State {
  readonly currentPageNum: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const PAGE_SIZE = 5;

const modalClasses: StringDict = {
  pool: 'modal_table_pool',
  shuffleBoard: 'modal_table_shuffle',
  tableTennis: 'modal_table_tennis',
  generic: 'modal_table_default'
};

const getSessionsHistoryInPending = (currentTable?: TableStore) =>
  currentTable ? currentTable.isSessionsHistoryInPending : false;

const getTableSessions = (
  allSessions: TableSessionsStore,
  table: TableStore
): ReadonlyArray<TableSessionStore> =>
  pipe<
    ReadonlyArray<number>,
    ReadonlyArray<string>,
    TableSessionsStore,
    ReadonlyArray<TableSessionStore>,
    ReadonlyArray<TableSessionStore>
  >(map(String), flip(pick)(allSessions), values, sortBy(prop('startsAt')))(
    table.sessionsHistory
  );

const getSessionsPage = (
  sessions: ReadonlyArray<TableSessionStore>,
  pageIdx: number
): ReadonlyArray<TableSessionStore> =>
  pipe<
    ReadonlyArray<TableSessionStore>,
    ReadonlyArray<ReadonlyArray<TableSessionStore>>,
    ReadonlyArray<TableSessionStore>
  >(splitEvery(PAGE_SIZE), nth(pageIdx))(sessions);

const enhance = compose(
  withState('currentPageNum', 'setCurrentPageNum', 0),
  withHandlers({
    requestToClose: ({ dispatch }: PropsFromConnect) => () =>
      dispatch(modalSessionsHistoryChanged(false)),
    onPageChangeHandler: ({ setCurrentPageNum }) => ({ selected }: any) =>
      setCurrentPageNum(selected)
  }),
  withHandlers({
    onCloseClick: ({ requestToClose }) => (
      event: MouseEvent<HTMLAnchorElement>
    ) => {
      event.preventDefault();
      requestToClose();
    },
    handleRequestClose: ({ requestToClose }) => () => requestToClose(),
    getPaginator: ({ onPageChangeHandler }) => ({
      numOfPages,
      currentPageNum,
      isInPending
    }: any) =>
      numOfPages > 1 && !isInPending
        ? <ReactPaginate
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
            onPageChange={onPageChangeHandler}
          />
        : null
  })
);

const ComponentView = ({
  allTableSessions,
  currentTable,
  isOpen,
  currentPageNum,
  handleRequestClose,
  onCloseClick,
  getPaginator
}: any) => {
  if (currentTable) {
    const historyPending = getSessionsHistoryInPending(currentTable);
    const modalClass = modalClasses[currentTable.tableType as string] || '';
    const caption = currentTable.name;
    const sessions = getTableSessions(allTableSessions, currentTable);
    const sessionCount = sessions.length;
    const sessionsPage = getSessionsPage(sessions, currentPageNum);
    const numOfPages = Math.ceil(sessionCount / PAGE_SIZE);
    const firstIdx = currentPageNum * PAGE_SIZE;

    return (
      <ReactModal
        contentLabel="Sessions History"
        isOpen={isOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={handleRequestClose}
        className={`modal modal_role_sessions-history ${modalClass}`}
        overlayClassName="modal__overlay"
      >
        <a className="modal__button-close" href="" onClick={onCloseClick} />
        <div className="modal__header">
          <h3 className="modal__header-caption">
            {caption}
          </h3>
          <h4 className="modal__header-sub-caption">Today's Sessions</h4>
        </div>

        <SessionsHistory
          isInPending={historyPending}
          tableSessions={sessionsPage}
          firstIdx={firstIdx}
        />

        {getPaginator({ numOfPages, currentPageNum, historyPending })}
      </ReactModal>
    );
  } else {
    return null;
  }
};

const Component = enhance(ComponentView);

const ModalSessionsHistory = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  const appData = state.app;
  const modalData = appData.modals.modalSessionsHistory;
  const tables = appData.tablesData.tables;
  const tableId = modalData.tableId;
  const currentTable = tableId ? tables[tableId] : undefined;

  return {
    isOpen: modalData.isOpened,
    tables,
    currentTable,
    allTableSessions: appData.tableSessionsData.tableSessions
  };
})(Component);

export default ModalSessionsHistory;
