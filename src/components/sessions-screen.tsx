import * as React from 'react';
import {connect} from 'react-redux';
import MouseEvent = React.MouseEvent;

import {StoreStructure, TableSessions} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

interface Props {
  sessions: TableSessions;
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, {}> {
  render() {
    return (
      <div>111111</div>
    );
  }
}

const SessionsScreen = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
    };
  }
)(Component);

export default SessionsScreen;
