import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import Table from './table';

export default class TablesGroup extends React.Component<AnyDict, AnyDict> {
  render() {
    return (
      <div className="tables-set">

        <Table />
        <Table status="disabled" />
        <Table status="active" />
        <Table />

      </div>
    );
  }
}
