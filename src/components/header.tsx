import * as React from 'react';
import { compose, lifecycle, withHandlers, withState } from 'recompose';

import MouseEvent = React.MouseEvent;
import { connect } from 'react-redux';
import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import adminTokenRemoved from '../action-creators/admin-token-removed';
import ModalAdminLogin from './modal-admin-login';

interface Props {}

interface MappedProps {
  readonly isAdminTokenSet: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const ManagerButton = (props: any) => {
  if (props.toLogIn) {
    return (
      <a href="" className="button button_role_manager" onClick={props.onBtnManagerClick}>
        Manager Mode
      </a>
    );
  } else {
    return (
      <a href="" className="button button_role_log-out" onClick={props.onBtnLogOutClick}>
        Log Out
      </a>
    );
  }
};

const enhance = compose(
  withState('isAdminModalOpen', 'setAdminModalOpen', false),
  withHandlers({
    onBtnManagerClick: ({ setAdminModalOpen }) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setAdminModalOpen(true);
      event.currentTarget.blur();
    },
    onModalClose: ({ setAdminModalOpen }) => () => setAdminModalOpen(false),
    onBtnLogOutClick: ({ dispatch }) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      dispatch(adminTokenRemoved);
    }
  }),
  lifecycle({
    componentWillReceiveProps(newProps: PropsFromConnect) {
      if (newProps.isAdminTokenSet !== this.props.isAdminTokenSet && !newProps.isAdminTokenSet) {
        (this.props as any).setAdminModalOpen(false);
      }
    }
  })
);

const Component = enhance(
  ({ isAdminTokenSet, onBtnManagerClick, onBtnLogOutClick, isAdminModalOpen, onModalClose }: any) =>
    <div className="header">
      <div className="header__section header__section_role_hamburger" />
      <div className="header__section header__section_role_caption">
        <span className="header__caption">Boston Pool Loft</span>
      </div>
      <div className="header__section header__section_role_utils">
        <ManagerButton
          toLogIn={isAdminTokenSet}
          onBtnManagerClick={onBtnManagerClick}
          onBtnLogOutClick={onBtnLogOutClick}
        />
      </div>

      <ModalAdminLogin isOpen={isAdminModalOpen} onClose={onModalClose} />
    </div>
);

const Header = connect<any, any, Props>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {
    isAdminTokenSet: state.app.adminToken === null
  };
})(Component);

export default Header;
