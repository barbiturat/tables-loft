import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;

import {StoreStructure, GlobalError} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

interface Props {
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  render() {
    return (
      <div className="block-screen"></div>
    );
  }
}

const ScreenBlocker = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
    };
  }
)(Component);

export default ScreenBlocker;
