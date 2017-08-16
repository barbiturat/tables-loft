import * as React from 'react';
import { connect } from 'react-redux';
import MouseEvent = React.MouseEvent;
import ReactModal from 'react-modal';

import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';

interface State {
  readonly isOpen: boolean;
}

interface Props {
  readonly isOpen: boolean;
  readonly message: string;
  readonly onClickOk: () => void;
  readonly onClose: () => void;
}

interface MappedProps {}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {
  state = {
    isOpen: false
  };

  componentWillReceiveProps(nextProps: PropsFromConnect) {
    const newIsOpen = nextProps.isOpen;

    if (newIsOpen !== this.props.isOpen) {
      this.setState({
        isOpen: newIsOpen
      });
    }
  }

  close = () => {
    this.setState({
      isOpen: false
    });
    this.props.onClose();
  };

  onClickOk = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.close();
    this.props.onClickOk();
  };

  onClickCancel = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.close();
  };

  render() {
    return (
      <ReactModal
        contentLabel="Prompt"
        isOpen={this.state.isOpen}
        shouldCloseOnOverlayClick={false}
        className="modal modal_role_prompt"
        overlayClassName="modal__overlay"
      >
        <h4 className="modal__description">
          {this.props.message}
        </h4>

        <div className="buttons-group">
          <a
            href=""
            className="button button_role_ok buttons-group_adjust_button"
            onClick={this.onClickOk}
          >
            Ok
          </a>
          <a
            href=""
            className="button button_role_cancel buttons-group_adjust_button"
            onClick={this.onClickCancel}
          >
            Cancel
          </a>
        </div>
      </ReactModal>
    );
  }
}

const ModalPrompt = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {};
})(Component);

export default ModalPrompt;
