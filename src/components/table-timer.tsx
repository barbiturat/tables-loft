import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;
import { createSelector, Selector } from 'reselect';

import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

interface Props {
  isActive: boolean;
  startsAt?: number;
}

interface State {
  isFormatOfMinutes: boolean;
}

interface MappedProps {
  utcMilliseconds: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {

  durationActivityStringSelector: Selector<PropsFromConnect, string>;

  constructor(props: Props) {
    super(props);

    this.state = {
      isFormatOfMinutes: false
    };

    this.durationActivityStringSelector = createSelector(
      Component.startsAtSelector,
      Component.utcMillisecondsSelector,
      Component.getDurationActivityString
    );
  }

  static startsAtSelector(props: PropsFromConnect) {
    return props.startsAt;
  };

  static utcMillisecondsSelector(props: PropsFromConnect) {
    return props.utcMilliseconds;
  };

  static getDurationActivityString(startsAt: number, utcMilliseconds: number) {
    if (!startsAt || !utcMilliseconds) {
      return 'Wrong Parameters!';
    }

    const utcMillisecondsFixed = Math.max(startsAt, utcMilliseconds);
    const durationMs = utcMillisecondsFixed - startsAt;

    return moment.utc(durationMs)
      .format('H[h] mm[m] ss[s]');
  }

  onClick = (event: MouseEvent<HTMLDivElement>) => {
    this.setState({
      isFormatOfMinutes: !this.state.isFormatOfMinutes
    });
  };

  render() {
    const labelAvailableText = !this.props.isActive ? 'Available' : this.durationActivityStringSelector(this.props);

    return (
      <div
          className="table__label table__label_role_availability"
          onClick={this.onClick}
      >
        {labelAvailableText}
      </div>
    );
  }
}

const TableTimer = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {
      utcMilliseconds: state.app.utcMilliseconds
    };
  }
)(Component);

export default TableTimer;
