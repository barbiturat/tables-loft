import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import {Table as TableStructure} from '../interfaces/component-models';
import Table from './table';

interface Props {
  tables: TableStructure[]
}

export default class TablesGroup extends React.Component<Props, AnyDict> {
  getTables = (tables: TableStructure[]) => {
    return tables.map((table, idx) => {
      return <Table
        key={idx}
        id={table.id}
        name={table.name}
        lastSession={table.lastSession}
        currentSession={table.currentSession}
        status={table.status}
        type={table.tableType}
      />
    });
  };

  render() {
    return (
      <div className="tables-set">
        {this.getTables(this.props.tables)}
      </div>
    );
  }
}
