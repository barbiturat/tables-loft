import { Observable } from 'rxjs';
import * as React from 'react';
import { connect } from 'react-redux';

import { StoreStructure } from '../interfaces/store-models';
import { compose, lifecycle, withHandlers, withProps, withState } from 'recompose';
// tslint:disable-next-line:no-require-imports
const ERROR_DISPLAY_DURATION = require('../../package.json').appSettings.ERROR_DISPLAY_DURATION;

interface Props {
  readonly message: string;
}

interface MappedProps {}

const TIME_TO_DISAPPEAR = (ERROR_DISPLAY_DURATION - 1) * 1000;

const enhance = compose(
  withState('isMounted', 'setMounted', false),
  withProps({
    errorContainer: HTMLDivElement
  }),
  withHandlers({
    updateErrorContainer: ({ errorContainer }) => () =>
      errorContainer.classList.add('global-errors-disappear')
  }),
  lifecycle({
    componentDidMount() {
      (this.props as any).setMounted(true);

      Observable.of(null)
        .delay(TIME_TO_DISAPPEAR)
        .takeWhile(() => (this.props as any).isMounted)
        .subscribe(() => (this.props as any).updateErrorContainer());
    },
    componentWillUnmount() {
      (this.props as any).setMounted(false);
    }
  })
);

const Component = enhance(({ errorContainer, message }: any) =>
  <div
    className="global-errors__error-window"
    ref={el => {
      if (el !== null) {
        errorContainer = el;
      }
    }}
  >
    <span className="global-errors__error-message">
      {message}
    </span>
  </div>
);

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
