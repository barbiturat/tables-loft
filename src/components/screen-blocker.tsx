import * as React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import { branch, compose, renderNothing } from 'recompose';
import * as R from 'ramda';

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

const WithToBlock = branch<PropsFromConnect>(R.compose(R.not, R.prop('toBlock')), renderNothing);

const ScreenBlocker = compose(
  connect<any, any, Props>((state: StoreStructure, ownProps: Props): MappedProps => ({
    toBlock: state.app.isBlockingRequestPending
  })),
  WithToBlock
);

export default ScreenBlocker(Modal);
