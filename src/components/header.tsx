import * as React from 'react';

import MouseEvent = React.MouseEvent;
import { connect } from 'react-redux';
import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import adminTokenRemoved from '../action-creators/admin-token-removed';
import ModalAdminLogin from './modal-admin-login';

interface State {
  readonly isAdminModalOpen: boolean;
}

interface Props {}

interface MappedProps {
  readonly isAdminTokenSet: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {
  state = {
    isAdminModalOpen: false
  };

  componentWillReceiveProps(newProps: PropsFromConnect) {
    if (
      newProps.isAdminTokenSet !== this.props.isAdminTokenSet &&
      !newProps.isAdminTokenSet
    ) {
      this.setState({
        isAdminModalOpen: false
      });
    }
  }

  onBtnManagerClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.setState({
      isAdminModalOpen: true
    });

    event.currentTarget.blur();
  };

  onModalClose = () => {
    this.setState({
      isAdminModalOpen: false
    });
  };

  onBtnLogOutClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch(adminTokenRemoved);
  };

  drawManagerButton(toLogIn: boolean) {
    if (toLogIn) {
      return (
        <a
          href=""
          className="button button_role_manager"
          onClick={this.onBtnManagerClick}
        >
          Manager Mode
        </a>
      );
    } else {
      return (
        <a
          href=""
          className="button button_role_log-out"
          onClick={this.onBtnLogOutClick}
        >
          Log Out
        </a>
      );
    }
  }

  render() {
    return (
      <div className="header">
        <div className="header__section header__section_role_hamburger" />
        <div className="header__section header__section_role_caption">
          <span className="header__caption">Boston Pool Loft</span>
        </div>
        <div className="header__section header__section_role_utils">
          {this.drawManagerButton(this.props.isAdminTokenSet)}
        </div>

        <ModalAdminLogin
          isOpen={this.state.isAdminModalOpen}
          onClose={this.onModalClose}
        />
      </div>
    );
  }
}

const Header = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {
    isAdminTokenSet: state.app.adminToken === null
  };
})(Component);

export default Header;
