import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;
import * as Modal from 'react-modal';

import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import modalAdminLoginOpened from '../action-creators/modal-admin-login-opened';

interface Props {
}

interface MappedProps {
  isOpen: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

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
      </Modal>
    );
  }
}

const ModalAdminLogin = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      isOpen: state.app.modals.adminLogin
    };
  }
)(Component);

export default ModalAdminLogin;
