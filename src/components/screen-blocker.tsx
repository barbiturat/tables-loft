import * as React from 'react';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';

import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

interface Props {
}

interface MappedProps {
  readonly toBlock: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  render() {
    return this.props.toBlock ? (
        <ReactModal
          contentLabel="Screen Blocker"
          isOpen={this.props.toBlock}
          shouldCloseOnOverlayClick={false}
          portalClassName="block-screen"
          className="block-screen__window"
          overlayClassName="block-screen__overlay"
        />
    ) : null;
  }
}

const ScreenBlocker = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      toBlock: state.app.isBlockingRequestPending
    };
  }
)(Component);

export default ScreenBlocker;
