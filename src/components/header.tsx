import * as React from 'react';

import MouseEvent = React.MouseEvent;
import modalAdminLoginOpened from '../action-creators/modal-admin-login-opened';
import store from '../store/index';

export default class Header extends React.Component<{}, {}> {
  onBtnManagerClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    store.dispatch( modalAdminLoginOpened(true) );
    event.currentTarget.blur();
  };

  render() {
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
              className="button button_role_manager"
              onClick={this.onBtnManagerClick}
          >Manager Mode</a>
        </div>
      </div>
    );
  }
}
