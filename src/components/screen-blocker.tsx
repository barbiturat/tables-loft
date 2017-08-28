import * as React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import { branch, compose, renderNothing } from 'recompose';

interface Props {}

interface MappedProps {
  readonly toBlock: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const Modal = (props: PropsFromConnect) =>
  <ReactModal
    contentLabel="Screen Blocker"
    isOpen={props.toBlock}
    shouldCloseOnOverlayClick={false}
    portalClassName="block-screen"
    className="block-screen__window"
    overlayClassName="block-screen__overlay"
  />;

const WithToBlock = branch<PropsFromConnect>(
  ({ toBlock }) => !toBlock,
  renderNothing
);

const ScreenBlocker = compose(
  connect<
    any,
    any,
    Props
  >((state: StoreStructure, ownProps: Props): MappedProps => ({
    toBlock: state.app.isBlockingRequestPending
  })),
  WithToBlock
);

export default ScreenBlocker(Modal);
