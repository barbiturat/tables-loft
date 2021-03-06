import { Observable } from 'rxjs';
import * as React from 'react';
import { connect } from 'react-redux';

import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
// tslint:disable-next-line:no-require-imports
const ERROR_DISPLAY_DURATION = require('../../package.json').appSettings
  .ERROR_DISPLAY_DURATION;

interface State {
  readonly isMounted: boolean;
}

interface Props {
  readonly message: string;
}

interface MappedProps {}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const timeToDisappear = (ERROR_DISPLAY_DURATION - 1) * 1000;

class Component extends React.Component<PropsFromConnect, State> {
  errorContainer: HTMLDivElement;

  state = {
    isMounted: false
  };

  componentDidMount() {
    this.setState({
      isMounted: true
    });

    Observable.of(null)
      .delay(timeToDisappear)
      .takeWhile(() => this.state.isMounted)
      .subscribe(() => this.updateErrorContainer());
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false
    });
  }

  updateErrorContainer = () => {
    this.errorContainer.classList.add('global-errors-disappear');
  };

  render() {
    return (
      <div
        className="global-errors__error-window"
        ref={el => {
          if (el !== null) {
            this.errorContainer = el;
          }
        }}
      >
        <span className="global-errors__error-message">
          {this.props.message}
        </span>
      </div>
    );
  }
}

const GlobalError = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {
    errors: state.app.globalErrors
  };
})(Component);

export default GlobalError;
