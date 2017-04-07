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

  const component = renderer.create(
    <TableTimerComponent
      {...props}
    />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onClick();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
