import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import * as Modal from 'react-modal';
import {Control, Form, Errors} from 'react-redux-form';

import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import modalAdminLoginOpened from '../action-creators/modal-admin-login-opened';
import {managerLoginForm} from '../constants/form-fields';
import {ManagerLoginForm} from '../reducers/forms';
import {isRequiredField} from '../constants/messages';
import {isNotEmpty as isFilled} from '../helpers';
import {renderErrorsBlock, renderErrorComponent} from '../helpers/renderers';
import {StringDict} from '../interfaces/index';
import requestingManagerLogin from '../action-creators/requesting-admin-token';

interface Props {
}

interface MappedProps {
  isOpen: boolean;
  managerLoginForm: ManagerLoginForm;
  pending: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const {validators: {password: passwordChecks}} = managerLoginForm;

class Component extends React.Component<PropsFromConnect, {}> {
  requestToClose() {
    this.props.dispatch( modalAdminLoginOpened(false) );
  };

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
        >
          close
        </a>
        <h3 className="modal__header">Manager Mode</h3>
        <h4 className="modal__description">Type password to enter manager mode</h4>

        {Component.getWaitMessage(this.props.pending)}

        <Form
          className="modal__form modal__form_role_login"
          model="formsData.managerLoginForm"
          onSubmit={this.handleSubmit}
        >
          <label className="label label_type_big modal_adjust_form-label">
            Password:
            <Control
              type="password"
              className="input input_type_big"
              autoComplete="false"
              model=".password"
              validators={{
                  [passwordChecks.isFilled]: isFilled,
                  [passwordChecks.isCorrect]: (() => true)
                }}
            />

            <Errors
              model=".password"
              messages={{
                isFilled: isRequiredField,
                isCorrect: 'Password is wrong'
              }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />

          </label>

          <input type="submit" value="Login" className="modal__button modal__button_role_login"/>
        </Form>


      </Modal>
    );
  }
}

const ModalAdminLogin = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      isOpen: state.app.modals.adminLogin,
      managerLoginForm: state.formsData.forms.managerLoginForm,
      pending: state.formsData.forms.managerLoginForm.$form.pending
    };
  }
)(Component);

export default ModalAdminLogin;
