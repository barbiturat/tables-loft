import * as React from 'react';
import {connect} from 'react-redux';

import {AnyDict} from '../interfaces/index';
import * as styles from '../styles/index.scss';
import fetchingTables from '../action-creators/fetching-tables';
import {PropsExtendedByConnect} from '../interfaces/component';
import {StoreStructure} from '../interfaces/store-models';
import changingTimer from '../action-creators/changing-timer';

type PropsFromConnect = PropsExtendedByConnect<AnyDict, AnyDict>;

class App extends React.Component<PropsFromConnect, AnyDict> {
  timer: number;

  componentWillMount() {
    this.props.dispatch(fetchingTables);

    this.timer = window.setInterval(() => {
      this.props.dispatch(changingTimer);
    }, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  render() {
    return (
      /* data-styles is used just to load styles */
      <div
          className="app"
          data-styles={styles}
      >
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: AnyDict): {} => {
  return {};
};

export default connect(
  mapStateToProps
)(App);
