import * as React from 'react';
import * as R from 'ramda';
import { mapProps } from 'recompose';

import Table, { Props as TableProps } from './table';
import { TablesStore, TableStore } from '../interfaces/store-models';
import { renameKeys } from '../helpers/index';

interface Props {
  readonly tables: TablesStore;
}

const numOrUndefined = R.unless(R.is(Number), R.always(undefined));

const SimpleTable = (props: TableProps): JSX.Element => <Table {...props} />;

const mapTableProps = mapProps<TableProps, TableStore>(
  R.pipe(
    R.pickAll([
      'id',
      'name',
      'tableType',
      'isInPending',
      'isDisabled',
      'currentSessionId',
      'lastSessionId'
    ]),
    renameKeys({ tableType: 'type' }),
    R.evolve<TableProps>({
      currentSessionId: numOrUndefined,
      lastSessionId: numOrUndefined
    })
  )
);

const MappedTable = mapTableProps(SimpleTable);

const drawTable = (props: TableStore, idx: number) =>
  <MappedTable key={idx} {...props} />;

const drawTables = R.pipe<
  TablesStore,
  ReadonlyArray<TableStore>,
  ReadonlyArray<JSX.Element>
>(R.values, R.addIndex(R.map)(drawTable));

const TablesGroup = ({ tables }: Props) =>
  <div className="tables-set">
    {drawTables(tables)}
  </div>;

export default TablesGroup;
