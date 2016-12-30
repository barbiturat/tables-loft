import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import {BaseComponentProps} from '../interfaces/component';
import MouseEvent = React.MouseEvent;

interface MappedProps {}

export default class Header extends React.Component<AnyDict, AnyDict> {
  onBtnManagerClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    console.log('onBtnManagerClick');
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
