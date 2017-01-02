import * as React from 'react';
import {find, assign} from 'lodash';

import {AnyDict} from '../interfaces/index';
import {PropsExtendedByConnect} from '../interfaces/component';
import {connect} from 'react-redux';
import fetchingTables from '../action-creators/fetching-tables';
import {StoreStructure, TableSession as TableSessionInStore} from '../interfaces/store-models';
import Header from './header';
import TablesGroup from './tables-group';
import {Table as ComponentTable} from '../interfaces/component-models';

interface MappedProps {
  tables: ComponentTable[];
  areTablesInPending: boolean;
  tableSessions: TableSessionInStore[];
}

type PropsFromConnect = PropsExtendedByConnect<AnyDict, MappedProps>;

class PageHome extends React.Component<PropsFromConnect, AnyDict> {
  componentWillMount() {
    this.props.dispatch(fetchingTables);
  }

  renderTablesGroup = (tables: ComponentTable[], isInPending: boolean) => {
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

const getSessionById = (sessions: TableSessionInStore[], id: number) => {
  return isNaN(id) ? null : find(sessions, (session: TableSessionInStore) => {
      return session.id === id;
    });
};

const mapStateToProps = (state: StoreStructure, ownProps?: AnyDict): MappedProps => {
  const appData = state.app;
  const tableSessions = appData.tableSessionsData.tableSessions;

  const formattedTables: ComponentTable[] = appData.tablesData.tables.map((table) => {
    const lastSession = getSessionById(tableSessions, table.lastSessionId);
    const currentSession = getSessionById(tableSessions, table.currentSessionId);

    return assign({}, table, {
      currentSession,
      lastSession
    });
  });

  return {
    areTablesInPending: appData.tablesData.isInPending,
    tables: formattedTables,
    tableSessions: appData.tableSessionsData.tableSessions
  };
};

export default connect(
  mapStateToProps
)(PageHome);
