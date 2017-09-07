import * as React from 'react';
import * as R from 'ramda';
import { mapProps } from 'recompose';

import Table, { Props as TableProps } from './table';
import { TablesStore, TableStore } from '../interfaces/store-models';
import { renameKeys } from '../helpers/index';

interface Props {
  readonly tables: TablesStore;
}

const getNumOrUndefined = R.unless(R.is(Number), R.always(undefined));

const SimpleTable = (props: TableProps): JSX.Element => <Table {...props} />;

const mapTableProps = mapProps<TableProps, TableStore>(
  R.compose(
    R.evolve<TableProps>({
      currentSessionId: getNumOrUndefined,
      lastSessionId: getNumOrUndefined
    }),
    renameKeys({ tableType: 'type' }),
    R.pickAll([
      'id',
      'name',
      'tableType',
      'isInPending',
      'isDisabled',
      'currentSessionId',
      'lastSessionId'
    ])
  )
);

const MappedTable = mapTableProps(SimpleTable);

const drawTable = (props: TableStore, idx: number) => <MappedTable key={idx} {...props} />;

const drawTables = R.compose<TablesStore, ReadonlyArray<JSX.Element>, ReadonlyArray<TableStore>>(
  R.addIndex(R.map)(drawTable),
  R.values
);

const TablesGroup = ({ tables }: Props) =>
  <div className="tables-set">
    {drawTables(tables)}
  </div>;

export default TablesGroup;
