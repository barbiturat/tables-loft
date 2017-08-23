import * as React from 'react';
import * as R from 'ramda';

import {AnyDict} from '../interfaces/index';
import Table, { Props as TableProps } from './table';
import { Tables } from '../interfaces/store-models';
import {renameKeys} from '../helpers/index';

interface Props {
  readonly tables: Tables;
}

const numOrUndefined = R.unless(R.is(Number), R.always(undefined));

export default class TablesGroup extends React.Component<Props, AnyDict> {
  static getTables(tables: Tables) {
    const generateTables = R.mapObjIndexed((table, idx) => R.pipe(
      R.pickAll(
        [
          'id',
          'name',
          'tableType',
          'isInPending',
          'isDisabled',
          'currentSessionId',
          'lastSessionId'
        ]
      ),
      renameKeys({tableType: 'type'}),
      R.evolve<TableProps>({
        currentSessionId: numOrUndefined,
        lastSessionId: numOrUndefined
      }),
      (params: TableProps) => <Table key={idx} {...params} />
    )(table));

    return R.pipe(generateTables, R.values)(tables);
  }

  render() {
    return (
      <div className="tables-set">
        {TablesGroup.getTables(this.props.tables)}
      </div>
    );
  }
}
