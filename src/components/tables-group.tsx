import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import Table from './table';
import {Tables} from '../interfaces/store-models';

interface Props {
  tables: Tables;
}

export default class TablesGroup extends React.Component<Props, AnyDict> {
  static getTables(tables: Tables) {
    return Object.keys(tables).map((value) => {
      const idx = Number(value);
      const table = tables[idx];

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
        {TablesGroup.getTables(this.props.tables)}
      </div>
    );
  }
}
