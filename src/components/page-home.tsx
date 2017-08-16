import * as React from 'react';

import { PropsExtendedByConnect } from '../interfaces/component';
import { connect } from 'react-redux';
import {
  StoreStructure,
  Tables,
  TableSessions
} from '../interfaces/store-models';
import Header from './header';
import TablesGroup from './tables-group';

interface MappedProps {
  readonly tables: Tables;
  readonly areTablesInPending: boolean;
  readonly tableSessions: TableSessions;
}

type PropsFromConnect = PropsExtendedByConnect<any, MappedProps>;

class Component extends React.Component<PropsFromConnect, any> {
  static renderTablesGroup(tables: Tables, isInPending: boolean) {
    return isInPending
      ? <div className="label label_type_wait label_role_wait-tables" />
      : <TablesGroup tables={tables} />;
  }

  render() {
    const { tables, areTablesInPending } = this.props;

    return (
      <div className="page">
        <Header />
        {Component.renderTablesGroup(tables, areTablesInPending)}
      </div>
    );
  }
}

const PageHome = connect<
  any,
  any,
  any
>((state: StoreStructure, ownProps?: any): MappedProps => {
  const appData = state.app;

  return {
    areTablesInPending: appData.tablesData.isInPending,
    tables: appData.tablesData.tables,
    tableSessions: appData.tableSessionsData.tableSessions
  };
})(Component);

export default PageHome;
