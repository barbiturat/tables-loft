import * as React from 'react';
import {find, assign} from 'lodash';

import {AnyDict} from '../interfaces/index';
import {BaseComponentProps} from '../interfaces/component';
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

interface ComponentProps extends BaseComponentProps, MappedProps {}

class PageHome extends React.Component<ComponentProps, AnyDict> {
  componentWillMount() {
    this.props.dispatch(fetchingTables);
  }

  render() {
    console.log('this.props.tables', this.props.tables);

    return (
      <div className="page">
        <Header/>
        <TablesGroup/>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: AnyDict): MappedProps => {
  const appData = state.app;
  const tableSessions = appData.tableSessionsData.tableSessions;

  const formattedTables: ComponentTable[] = appData.tablesData.tables.map((table) => {
    const lastSessionId = table.lastSessionId;
    const lastSession = isNaN(lastSessionId) ? null : find(tableSessions, (session: TableSessionInStore) => {
      return session.id === lastSessionId;
    });

    return assign({}, table, {
      lastSession: lastSession
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
