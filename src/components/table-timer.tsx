import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;
import { createSelector, Selector } from 'reselect';

import {StoreStructure} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

interface Props {
  readonly isActive: boolean;
  readonly startsAt?: number;
}

interface State {
  readonly isFormatOfMinutes: boolean;
}

interface MappedProps {
  readonly utcMilliseconds: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

export class Component extends React.Component<PropsFromConnect, State> {

  durationActivityStringSelector: Selector<PropsFromConnect, string>;

  constructor(props: PropsFromConnect) {
    super(props);

    this.state = {
      isFormatOfMinutes: false
    };

    this.durationActivityStringSelector = createSelector(
      Component.startsAtSelector,
      Component.utcMillisecondsSelector,
      this.isFormatOfMinutesSelector.bind(this),
      Component.getDurationActivityString
    );
  }

  isFormatOfMinutesSelector(props: PropsFromConnect) {
    return this.state.isFormatOfMinutes;
  }

  static startsAtSelector(props: PropsFromConnect) {
    return props.startsAt;
  }

  static utcMillisecondsSelector(props: PropsFromConnect) {
    return props.utcMilliseconds;
  }

  static getDurationActivityString(startsAt: number, utcMilliseconds: number, isFormatOfMinutes: boolean) {
    if (!startsAt || !utcMilliseconds) {
      return 'Wrong Parameters!';
    }

    const utcMillisecondsFixed = Math.max(startsAt, utcMilliseconds);
    const durationMs = utcMillisecondsFixed - startsAt;

    if (isFormatOfMinutes) {
      const duration = moment.duration(durationMs);
      const minutes = Math.floor( duration.asMinutes() );

      return `${minutes}m`;
    } else {
      return moment.utc(durationMs)
        .format('H[h] mm[m] ss[s]');
    }
  }

  onClick = () => {
    this.setState({
      isFormatOfMinutes: !this.state.isFormatOfMinutes
    });
  };

  render() {
    const isAvailable = !this.props.isActive;
    const labelAvailableText = isAvailable ? 'Available' : this.durationActivityStringSelector(this.props);
    const availabilityClass = isAvailable ?
      'table__label table__label_role_availability' : 'table__label table__label_role_counter';

    return (
      <div
          className={availabilityClass}
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
