import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import {BaseComponentProps} from '../interfaces/component';
import {connect} from 'react-redux';
import fetchingTables from '../action-creators/fetching-tables';
import {StoreStructure} from '../interfaces/store-models';
import Header from './header';
import TablesGroup from './tables-group';

interface MappedProps {}

interface ComponentProps extends BaseComponentProps, MappedProps {}

class PageHome extends React.Component<ComponentProps, AnyDict> {
  componentWillMount() {
    this.props.dispatch(fetchingTables);
  }

  render() {
    return (
      <div className="page">
        <Header/>
        <TablesGroup/>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: AnyDict): MappedProps => {
  return {
  };
};

export default connect(
  mapStateToProps
)(PageHome);
