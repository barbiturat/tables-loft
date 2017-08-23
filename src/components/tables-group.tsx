import * as React from 'react';
import * as R from 'ramda';

import Table, { Props as TableProps } from './table';
import { Tables } from '../interfaces/store-models';
import {indexedDictToArray, renameKeys} from '../helpers/index';

interface Props {
  readonly tables: Tables;
}

const numOrUndefined = R.unless(R.is(Number), R.always(undefined));
const drawT = (params: TableProps & {readonly idx: number}): JSX.Element => <Table key={params.idx} {...params} />;

const drawTable = R.pipe(
  R.pickAll(
    [
      'id',
      'idx',
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
  drawT
);

const drawTables = R.pipe<Tables, ReadonlyArray<{}>, ReadonlyArray<JSX.Element> >(
  indexedDictToArray('idx'),
  R.map(drawTable)
);

const TablesGroup = (props: Props) =>
  <div className="tables-set">
    {drawTables(props.tables)}
  </div>;

export default TablesGroup;
