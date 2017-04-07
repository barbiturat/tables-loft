import * as React from 'react';
import * as renderer from 'react-test-renderer';
import {Action} from 'redux';

import {Component as TableTimerComponent} from './table-timer';

test('TableTimer renders correctly', () => {
  const startsAt = 1491581751312;
  const utcMilliseconds = 1491581751312;
  const isActive = true;

  const props = {
    isActive,
    utcMilliseconds,
    startsAt,
    dispatch: (action: Action) => action
  };

  const tree = (renderer as any).create(
    <TableTimerComponent
      {...props}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
