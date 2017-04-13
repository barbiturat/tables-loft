import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import Table, {Props as TableProps} from './table';
import {Tables} from '../interfaces/store-models';

interface Props {
  readonly tables: Tables;
}

export default class TablesGroup extends React.Component<Props, AnyDict> {
  static getTables(tables: Tables) {
    return Object.keys(tables).map((value) => {
      const idx = Number(value);
      const {id, name, currentSessionId, lastSessionId, tableType, isInPending, isDisabled} = tables[idx];
      const params: TableProps = {
        id,
        name,
        type: tableType,
        isInPending,
        isDisabled,
        currentSessionId: typeof currentSessionId === 'number' ? currentSessionId : undefined,
        lastSessionId: typeof lastSessionId === 'number' ? lastSessionId : undefined
      };

      return (
        <Table key={idx} {...params}/>
      );
    });
  }

  render() {
    return (
      <div className="tables-set">
        {TablesGroup.getTables(this.props.tables)}
      </div>
    );
  }
}
