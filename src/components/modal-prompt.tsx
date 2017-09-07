import * as React from 'react';
import { connect } from 'react-redux';
import MouseEvent = React.MouseEvent;
import ReactModal from 'react-modal';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import * as R from 'ramda';

import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';

interface Props {
  readonly isOpen: boolean;
  readonly message: string;
  readonly onClickOk: () => void;
  readonly onClose: () => void;
}

interface MappedProps {}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const close = (setOpenInner: Function, onClose: Function) => {
  setOpenInner(false);
  onClose();
};

const enhance = compose(
  withState('isOpenInner', 'setOpenInner', false),
  withHandlers({
    onClickOkInner: ({ onClickOk, setOpenInner, onClose }) => (
      event: MouseEvent<HTMLAnchorElement>
    ) => {
      event.preventDefault();
      close(setOpenInner, onClose);
      onClickOk();
    },
    onClickCancel: ({ setOpenInner, onClose }) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      close(setOpenInner, onClose);
    }
  }),
  lifecycle({
    componentWillReceiveProps(nextProps: PropsFromConnect) {
      R.unless(R.identical(this.props.isOpen), (this.props as any).setOpenInner)(nextProps.isOpen);
    }
  })
);

const Component = enhance(({ isOpen, message, onClickOkInner, onClickCancel }: any) =>
  <ReactModal
    contentLabel="Prompt"
    isOpen={isOpen}
    shouldCloseOnOverlayClick={false}
    className="modal modal_role_prompt"
    overlayClassName="modal__overlay"
  >
    <h4 className="modal__description">
      {message}
    </h4>

    <div className="buttons-group">
      <a
        href=""
        className="button button_role_ok buttons-group_adjust_button"
        onClick={onClickOkInner}
      >
        Ok
      </a>
      <a
        href=""
        className="button button_role_cancel buttons-group_adjust_button"
        onClick={onClickCancel}
      >
        Cancel
      </a>
    </div>
  </ReactModal>
);

const ModalPrompt = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {};
})(Component);

export default ModalPrompt;
