import * as React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory,
  RouterState
} from 'react-router';

import App from './components/app';
import LoginPage from './components/page-login';
import HomePage from './components/page-home';
import NotFoundPage from './components/page-not-found';

// import {isLogged} from 'utils/localstorage';

/*
function requireAuth(nextState: RouterState, replace: (pathName: string) => void) {
  if (!isLogged()) {
    replace('/login');
  }
}
*/

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={LoginPage} />
      <IndexRoute component={HomePage} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
