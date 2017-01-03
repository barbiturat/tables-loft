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
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const {validators: {password: passwordChecks}} = managerLoginForm;

class Component extends React.Component<PropsFromConnect, {}> {
  requestToClose = () => {
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

  render() {
    return (
      <Modal
        contentLabel="Admin Login"
        isOpen={this.props.isOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={this.handleRequestCloseFunc}
      >
        <a href=""
           onClick={this.onCloseClick}
        >
          close
        </a>

        <Form
          model="formsData.managerLoginForm"
          onSubmit={this.handleSubmit}
        >
          <label className="form-label">
            Password:
            <Control
              type="password"
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

          <input type="submit" value="submit"/>
        </Form>


      </Modal>
    );
  }
}

const ModalAdminLogin = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      isOpen: state.app.modals.adminLogin && state.app.adminToken === null,
      managerLoginForm: state.formsData.forms.managerLoginForm
    };
  }
)(Component);

export default ModalAdminLogin;
