import * as React from 'react';
import { connect } from 'react-redux';
import { Observable } from 'rxjs';
import { compose, withHandlers, withState, lifecycle } from 'recompose';

import { AnyDict } from '../interfaces/index';
import * as styles from '../styles/index.scss';
import fetchingTables from '../action-creators/fetching-tables';
import { StoreStructure } from '../interfaces/store-models';
import changingUtcMilliseconds from '../action-creators/changing-utc-milliseconds';
import ModalSessionsHistory from './modal-sessions-history';
import GlobalErrors from './global-errors';
import ScreenBlocker from './screen-blocker';

interface MappedProps {}

const enhance = compose(
  withState('isMounted', 'setMounted', false),
  withHandlers({
    getMounted: ({ isMounted }) => () => isMounted
  }),
  withHandlers({
    setGlobalTimer: ({ isMounted, dispatch, getMounted }) => () =>
      Observable.interval(1000)
        .takeWhile(() => {
          return getMounted();
        })
        .subscribe(() => dispatch(changingUtcMilliseconds))
  }),
  lifecycle({
    componentDidMount() {
      (this.props as any).setMounted(true);

      (this.props as any).setGlobalTimer();
      (this.props as any).dispatch(fetchingTables);
    },
    componentWillUnmount() {
      (this.props as any).setMounted(false);
    }
  })
);

const App = enhance(({ children, isMounted }: any) =>
  <div className="app" data-styles={styles}>
    {children}

    <ScreenBlocker />

    <ModalSessionsHistory />
    <GlobalErrors />
  </div>
);

const mapStateToProps = (
  state: StoreStructure,
  ownProps?: AnyDict
): MappedProps => {
  return {};
};

export default connect(mapStateToProps)(App);
