import * as React from 'react';
import {shallow} from 'enzyme';
import {FieldState} from 'react-redux-form';

import {renderErrorsBlock} from './renderers';

describe('renderErrorsBlock', () => {
  it('renders block with passed children', () => {
    const childrenEl = (<div id="someEl">
      <span className="someChild">111</span>
    </div>);

    const resultBlock = renderErrorsBlock({
      model: '',
      modelValue: '',
      fieldValue: {} as FieldState,
      children: childrenEl
    });

    const component = shallow(resultBlock);

    expect(component.childAt(0).is('div#someEl')).toBe(true);
    expect(component.childAt(0).childAt(0).is('span.someChild')).toBe(true);
  });
});
