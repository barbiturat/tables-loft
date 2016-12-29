import * as React from 'react';
import {ErrorsProps, WrapperProps, CustomComponentProps} from 'react-redux-form';

export const renderErrorsBlock: React.StatelessComponent<ErrorsProps & WrapperProps> =
  (props) => <div className="form-errors">{props.children}</div>;

export const renderErrorComponent: React.StatelessComponent<ErrorsProps & CustomComponentProps> =
  (props) => <div className="error">{props.children}</div>;
