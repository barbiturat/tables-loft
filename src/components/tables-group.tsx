import * as React from 'react';
import * as R from 'ramda';
import { mapProps } from 'recompose';

import Table, { Props as TableProps } from './table';
import { Tables, Table as StoreTable } from '../interfaces/store-models';
import { indexedDictToArray, renameKeys } from '../helpers/index';
import { drawListComponent } from 'helpers/renderers';

interface Props {
  readonly tables: Tables;
}

type TablePropsWithIdx = TableProps & { readonly idx: number };
type StoreTableWithIdx = StoreTable & { readonly idx: number };

const numOrUndefined = R.unless(R.is(Number), R.always(undefined));

const SimpleTable = (params: TablePropsWithIdx): JSX.Element =>
  <Table key={params.idx} {...params} />;

const mapTableProps = mapProps<TablePropsWithIdx, StoreTableWithIdx>(
  R.pipe(
    R.pickAll([
      'id',
      'idx',
      'name',
      'tableType',
      'isInPending',
      'isDisabled',
      'currentSessionId',
      'lastSessionId'
    ]),
    renameKeys({ tableType: 'type' }),
    R.evolve<TablePropsWithIdx>({
      currentSessionId: numOrUndefined,
      lastSessionId: numOrUndefined
    })
  )
);

const MappedTable = mapTableProps(SimpleTable);

const drawTable = drawListComponent(MappedTable);

const drawTables = R.pipe<
  Tables,
  ReadonlyArray<StoreTableWithIdx>,
  ReadonlyArray<JSX.Element>
>(indexedDictToArray('idx'), R.addIndex(R.map)(drawTable));

const TablesGroup = ({ tables }: Props) =>
  <div className="tables-set">
    {drawTables(tables)}
  </div>;

export default TablesGroup;
