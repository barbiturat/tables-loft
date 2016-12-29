import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import * as styles from '../styles/index.scss';

export default class App extends React.Component<AnyDict, AnyDict> {
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
