import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;

import {StoreStructure, GlobalError} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

interface Props {
}

interface MappedProps {
  errors: GlobalError[];
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  static drawErrors(errors: GlobalError[]) {
    return errors.map((error, idx) => {
      return (
        <div key={idx} className="global-errors__error-window">
          <span className="global-errors__error-message">{error.message}</span>
        </div>
      );
    });
  }

  render() {
    const errors = this.props.errors;

    return errors ? (
      <div className="global-errors">
        {Component.drawErrors(errors)}
      </div>
    ) : null;
  }
}

const GlobalErrors = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      errors: state.app.globalErrors
    };
  }
)(Component);

export default GlobalErrors;
