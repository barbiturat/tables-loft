import * as React from 'react';

import MouseEvent = React.MouseEvent;
import modalAdminLoginOpened from '../action-creators/modal-admin-login-opened';
import {connect} from 'react-redux';
import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';
import adminTokenRemoved from '../action-creators/admin-token-removed';

interface Props {
}

interface MappedProps {
  isAdminTokenSet: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  onBtnManagerClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch( modalAdminLoginOpened(true) );

    event.currentTarget.blur();
  };

  onBtnLogOutClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch( adminTokenRemoved );
  };

  drawManagerButton(toLogIn: boolean) {
    if (toLogIn) {
      return (
        <a href=""
           className="button button_role_manager"
           onClick={this.onBtnManagerClick}
        >Manager Mode</a>
      );
    } else {
      return (
        <a href=""
           className="button button_role_log-out"
           onClick={this.onBtnLogOutClick}
        >Log Out</a>
      );
    }
  }

  render() {
    return (
      <div className="header">
        <div className="header__section header__section_role_hamburger">
        </div>
        <div className="header__section header__section_role_caption">
          <span className="header__caption">Boston Pool Loft</span>
        </div>
        <div className="header__section header__section_role_utils">
          { this.drawManagerButton(this.props.isAdminTokenSet) }
        </div>
      </div>
    );
  }
}

const Header = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      isAdminTokenSet: state.app.adminToken === null
    };
  }
)(Component);

export default Header;
