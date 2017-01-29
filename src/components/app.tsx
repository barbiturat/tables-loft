import * as React from 'react';
import {connect} from 'react-redux';
import {Observable} from 'rxjs';

import {AnyDict} from '../interfaces/index';
import * as styles from '../styles/index.scss';
import fetchingTables from '../action-creators/fetching-tables';
import {PropsExtendedByConnect} from '../interfaces/component';
import {StoreStructure} from '../interfaces/store-models';
import changingUtcMilliseconds from '../action-creators/changing-utc-milliseconds';
import ModalSessionsHistory from './modal-sessions-history';
import GlobalErrors from './global-errors';
import ScreenBlocker from './screen-blocker';

interface Props {
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  isMounted: boolean;
}

class App extends React.Component<PropsFromConnect, State> {
  state = {
    isMounted: false
  };

  componentWillMount() {
    this.setState({
      isMounted: true
    });

    this.setGlobalTimer();

    this.props.dispatch(fetchingTables);
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false
    });
  }

  setGlobalTimer() {
    Observable.interval(1000)
      .takeWhile(() => this.state.isMounted)
      .subscribe(() => this.props.dispatch(changingUtcMilliseconds));
  }

  render() {
    return (
      /* data-styles is used just to load styles */
      <div
          className="app"
          data-styles={styles}
      >
        {this.props.children}

        <ScreenBlocker/>

        <ModalSessionsHistory/>
        <GlobalErrors/>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: AnyDict): MappedProps => {
  return {};
};

export default connect(
  mapStateToProps
)(App);
