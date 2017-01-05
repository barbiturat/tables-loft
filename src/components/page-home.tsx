import * as React from 'react';

import {PropsExtendedByConnect} from '../interfaces/component';
import {connect} from 'react-redux';
import {StoreStructure, TableSession as TableSessionInStore, Table} from '../interfaces/store-models';
import Header from './header';
import TablesGroup from './tables-group';

interface MappedProps {
  tables: Table[];
  areTablesInPending: boolean;
  tableSessions: TableSessionInStore[];
}

type PropsFromConnect = PropsExtendedByConnect<any, MappedProps>;

class Component extends React.Component<PropsFromConnect, any> {

  renderTablesGroup = (tables: Table[], isInPending: boolean) => {
    return isInPending ? (
        <div className="label label_type_wait label_role_wait-tables"/>
      ) : (
        <TablesGroup tables={tables}/>
      );
  };

  render() {
    return (
      <div className="page">
        <Header/>
        {this.renderTablesGroup(this.props.tables, this.props.areTablesInPending)}
      </div>
    );
  }
}

const PageHome = connect<any, any, any>(
  (state: StoreStructure, ownProps?: any): MappedProps => {
    const appData = state.app;

    return {
      areTablesInPending: appData.tablesData.isInPending,
      tables: appData.tablesData.tables,
      tableSessions: appData.tableSessionsData.tableSessions
    };
})(Component);

export default PageHome;

