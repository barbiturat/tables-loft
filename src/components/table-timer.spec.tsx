import * as React from 'react';
import * as renderer from 'react-test-renderer';
import {Action} from 'redux';
import {shallow} from 'enzyme';

import {Component as TableTimerComponent} from './table-timer';

test('Renders correctly', () => {
  const component = renderer.create(
    <TableTimerComponent
      isActive={true}
      utcMilliseconds={1491581751312}
      startsAt={1491581751312}
      dispatch={(action: Action) => action}
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

/*
test('Reacts on click correctly', () => {
  const component = shallow(
    <TableTimerComponent
      isActive={true}
      utcMilliseconds={1491581751312}
      startsAt={1491581751312}
      dispatch={(action: Action) => action}
    />
  );

  expect(component.find('div').text()).toEqual('0h 00m 00s');

  component.find('div').simulate('click');

  expect(component.find('div').text()).toEqual('0m');
});
*/
