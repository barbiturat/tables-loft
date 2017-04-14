import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;

import {StoreStructure, GlobalError as GlobalErrorType} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import GlobalError from './global-error';

interface Props {
}

interface MappedProps {
  readonly errors: ReadonlyArray<GlobalErrorType>;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  static drawErrors(errors: ReadonlyArray<GlobalErrorType>) {
    return errors.map((error) => (
      <GlobalError
        key={error.date}
        message={error.message}
      />
    ));
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
