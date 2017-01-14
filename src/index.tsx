import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-router';

import store from './store/index';

/*store.subscribe(() => {
  console.log('store.getState()', store.getState());
});*/

const Root = class extends React.Component <{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <ReduxRouter />
      </Provider>
    );
  }
};

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
