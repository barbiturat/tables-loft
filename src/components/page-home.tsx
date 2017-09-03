import * as React from 'react';
import * as R from 'ramda';
import { branch, compose, renderComponent } from 'recompose';

import { PropsExtendedByConnect } from '../interfaces/component';
import { connect } from 'react-redux';
import { StoreStructure, TablesStore, TableSessionsStore } from '../interfaces/store-models';
import Header from './header';
import TablesGroup from './tables-group';

interface MappedProps {
  readonly tables: TablesStore;
  readonly areTablesInPending: boolean;
  readonly tableSessions: TableSessionsStore;
}

type PropsFromConnect = PropsExtendedByConnect<any, MappedProps>;

const TablesGroupEnhance = compose(
  branch(
    R.prop('areTablesInPending'),
    renderComponent(() => <div className="label label_type_wait label_role_wait-tables" />)
  )
)(({ tables }: PropsFromConnect) => <TablesGroup tables={tables} />);

const Component = (props: PropsFromConnect) =>
  <div className="page">
    <Header />
    <TablesGroupEnhance {...props} />
  </div>;

const PageHome = connect<
  MappedProps,
  null,
  {}
>((state: StoreStructure, ownProps?: any): MappedProps => {
  return R.applySpec<MappedProps>({
    areTablesInPending: R.path(['tablesData', 'isInPending']),
    tables: R.path(['tablesData', 'tables']),
    tableSessions: R.path(['tableSessionsData', 'tableSessions'])
  })(state.app);
})(Component);

export default PageHome;
