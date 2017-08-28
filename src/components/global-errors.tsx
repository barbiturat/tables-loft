import * as React from 'react';
import { connect } from 'react-redux';
import { branch, compose, renderNothing } from 'recompose';

import {
  StoreStructure,
  GlobalError as GlobalErrorType
} from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import GlobalError from './global-error';

interface Props {}

interface MappedProps {
  readonly errors: ReadonlyArray<GlobalErrorType>;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const drawErrors = (errors: ReadonlyArray<GlobalErrorType>) =>
  errors.map(error => <GlobalError key={error.date} message={error.message} />);

const ErrorsComponent = ({ errors }: PropsFromConnect) =>
  <div className="global-errors">
    {drawErrors(errors)}
  </div>;

const checkForErrors = branch<PropsFromConnect>(
  ({ errors }) => !errors,
  renderNothing
);

const GlobalErrors = compose(
  connect<
    any,
    any,
    Props
  >((state: StoreStructure, ownProps: Props): MappedProps => ({
    errors: state.app.globalErrors
  })),
  checkForErrors
);

export default GlobalErrors(ErrorsComponent);
