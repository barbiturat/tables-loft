import * as React from 'react';

import MouseEvent = React.MouseEvent;
import modalAdminLoginOpened from '../action-creators/modal-admin-login-opened';
import {connect} from 'react-redux';
import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

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

  render() {
    const managerModeButtonClass = `button button_role_manager ${this.props.isAdminTokenSet ? '' : 'hidden'}`;

    return (
      <div className="header">
        <div className="header__section header__section_role_hamburger">
          <a href="" className="header__hamburger-btn">
            <div className="header__hamburger-btn-content"></div>
          </a>
        </div>
        <div className="header__section header__section_role_caption">
          <span className="header__caption">Boston Pool Loft</span>
        </div>
        <div className="header__section header__section_role_utils">
          <a href=""
              className={managerModeButtonClass}
              onClick={this.onBtnManagerClick}
          >Manager Mode</a>
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
