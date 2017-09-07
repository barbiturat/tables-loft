import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, branch, renderNothing, withProps } from 'recompose';
import MouseEvent = React.MouseEvent;
import ReactModal from 'react-modal';
import * as ReactPaginate from 'react-paginate';
import * as R from 'ramda';

import {
  StoreStructure,
  TableStore,
  TableSessionStore,
  TablesStore,
  TableSessionsStore
} from '../interfaces/store-models';
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

const PAGE_SIZE = 5;

const MODAL_CLASSES: StringDict = {
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
  R.pipe<
    ReadonlyArray<number>,
    ReadonlyArray<string>,
    TableSessionsStore,
    ReadonlyArray<TableSessionStore>,
    ReadonlyArray<TableSessionStore>
  >(R.map(String), R.flip(R.pick)(allSessions), R.values, R.sortBy(R.prop('startsAt')))(
    table.sessionsHistory
  );

const getSessionsPage = (
  sessions: ReadonlyArray<TableSessionStore>,
  pageIdx: number
): ReadonlyArray<TableSessionStore> =>
  R.pipe<
    ReadonlyArray<TableSessionStore>,
    ReadonlyArray<ReadonlyArray<TableSessionStore>>,
    ReadonlyArray<TableSessionStore>
  >(R.splitEvery(PAGE_SIZE), R.nth(pageIdx))(sessions);

const requestToClose = (dispatch: Function) => dispatch(modalSessionsHistoryChanged(false));

const getPaginator = (
  onPageChangeHandler: (selectedItem: any) => void,
  numOfPages: number,
  currentPageNum: number,
  isInPending: boolean
) =>
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
    : null;

const enhance = compose(
  withState('currentPageNum', 'setCurrentPageNum', 0),
  withHandlers({
    onPageChangeHandler: ({ setCurrentPageNum }) => ({ selected }: any) =>
      setCurrentPageNum(selected)
  }),
  withHandlers({
    onCloseClick: ({ dispatch }) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      requestToClose(dispatch);
    },
    onRequestClose: ({ dispatch }) => () => requestToClose(dispatch)
  }),
  branch(R.compose(R.not, R.prop('currentTable')), renderNothing),
  withProps(({ allTableSessions, currentTable, currentPageNum }) => {
    const sessions = getTableSessions(allTableSessions, currentTable);

    return {
      historyPending: getSessionsHistoryInPending(currentTable),
      modalClass: MODAL_CLASSES[currentTable.tableType as string] || '',
      caption: currentTable.name,
      sessionsPage: getSessionsPage(sessions, currentPageNum),
      numOfPages: Math.ceil(sessions.length / PAGE_SIZE),
      firstIdx: currentPageNum * PAGE_SIZE
    };
  })
);

const Component = enhance(
  ({
    isOpen,
    currentPageNum,
    onRequestClose,
    onCloseClick,
    historyPending,
    modalClass,
    caption,
    sessionsPage,
    numOfPages,
    firstIdx,
    onPageChangeHandler
  }: any) => {
    return (
      <ReactModal
        contentLabel="Sessions History"
        isOpen={isOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={onRequestClose}
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

        {getPaginator(onPageChangeHandler, numOfPages, currentPageNum, historyPending)}
      </ReactModal>
    );
  }
);

const ModalSessionsHistory = connect<any, any, Props>(({ app }: StoreStructure): MappedProps => {
  const getModalSessionsHistory = R.path(['modals', 'modalSessionsHistory']);
  const getTables = R.path(['tablesData', 'tables']);
  const getTableId = R.compose(R.prop('tableId'), getModalSessionsHistory);

  return R.applySpec<MappedProps>({
    isOpen: R.compose(R.prop('isOpened'), getModalSessionsHistory),
    tables: getTables,
    currentTable: R.converge(R.prop, [getTableId, getTables]),
    allTableSessions: R.path(['tableSessionsData', 'tableSessions'])
  })(app);
})(Component);

export default ModalSessionsHistory;
