import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import * as Modal from 'react-modal';
import {Control, Form, Errors, actions, ErrorsProps, WrapperProps, CustomComponentProps} from 'react-redux-form';

import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import {managerLoginForm} from '../constants/form-fields';
import {ManagerLoginForm} from '../reducers/forms';
import {isRequiredField} from '../constants/messages';
import {isNotEmpty as isFilled} from '../helpers';
import {StringDict} from '../interfaces/index';
import requestingManagerLogin from '../action-creators/requesting-admin-token';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface MappedProps {
  readonly managerLoginForm: ManagerLoginForm;
  readonly pending: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const {validators: {password: passwordChecks}} = managerLoginForm;

class Component extends React.Component<PropsFromConnect, {}> {
  requestToClose() {
    this.resetPasswordInput();
    this.props.onClose();
  };

  resetPasswordInput() {
    this.props.dispatch( actions.change('formsData.managerLoginForm.password', '') );
    this.props.dispatch( actions.setInitial('formsData.managerLoginForm.password') );
  }

  onCloseClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.requestToClose();
  };

  handleRequestCloseFunc = () => {
    this.requestToClose();
  };

  handleSubmit = (formModelData: StringDict) => {
      const action = requestingManagerLogin('formsData.managerLoginForm', formModelData);

    this.props.dispatch(action);
  };

  static getWaitMessage(isPending: boolean) {
    return isPending ? (
        <div>Wait...</div>
      ) : null;
  };

  static renderErrorsBlock: React.StatelessComponent<ErrorsProps & WrapperProps> =
    (props) => <div className="modal__form-errors">{props.children}</div>;

  static renderErrorComponent: React.StatelessComponent<ErrorsProps & CustomComponentProps> =
    (props) => <div className="modal__form-error">{props.children}</div>;

  render() {
    return (
      <Modal
        contentLabel="Admin Login"
        isOpen={this.props.isOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={this.handleRequestCloseFunc}
        className="modal modal_role_login-manager"
        overlayClassName="modal__overlay"
      >
        <a className="modal__button-close" href=""
           onClick={this.onCloseClick}
        />
        <div className="modal__header">
          <h3 className="modal__header-caption">Manager Mode</h3>
        </div>
        <h4 className="modal__description">Type password to enter manager mode</h4>

        {Component.getWaitMessage(this.props.pending)}

        <Form
          className="modal__form modal__form_role_login"
          model="formsData.managerLoginForm"
          onSubmit={this.handleSubmit}
        >
          <label className="form-label form-label_type_big form-label_role_password modal_adjust_form-label">
            <Control
              type="password"
              className="input input_type_big input_role_manager-password"
              autoComplete="false"
              autoFocus={true}
              model=".password"
              validators={{
                  [passwordChecks.isFilled]: isFilled,
                  [passwordChecks.isCorrect]: (() => true)
                }}
            />
          </label>

          <Errors
            model=".password"
            messages={{
                isFilled: isRequiredField,
                isCorrect: 'Password is wrong'
              }}
            show={{touched: true}}
            wrapper={Component.renderErrorsBlock}
            component={Component.renderErrorComponent}
          />

          <div className="modal__buttons-group">
            <input type="submit" value="Login" className="button button_type_modal-big"/>
          </div>
        </Form>


      </Modal>
    );
  }
}

const ModalAdminLogin = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      managerLoginForm: state.formsData.forms.managerLoginForm,
      pending: state.formsData.forms.managerLoginForm.$form.pending
    };
  }
)(Component);

export default ModalAdminLogin;
