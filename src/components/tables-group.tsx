import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import Table from './table';
import {Table as TableStructure} from '../interfaces/component-models';

interface Props {
  tables: TableStructure[];
}

export default class TablesGroup extends React.Component<Props, AnyDict> {
  getTables = (tables: TableStructure[]) => {
    return tables.map((table, idx) => {
      return (
        <Table
          key={idx}
          id={table.id}
          name={table.name}
          currentSessionId={table.currentSessionId}
          lastSessionId={table.lastSessionId}
          type={table.tableType}
          isInPending={table.isInPending}
          isDisabled={table.isDisabled}
        />
      );
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
