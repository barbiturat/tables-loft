import * as React from 'react';
import * as renderer from 'react-test-renderer';

import {Component as TableTimerComponent} from './table-timer';

test('TableTimer renders correctly', () => {
  const now = 1491581751312;
  const isActive = true;

  const tree = (renderer as any).create(
    <TableTimerComponent
      isActive={isActive}
      startsAt={now}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
