import * as React from 'react';
import {connect} from 'react-redux';
import * as moment from 'moment';
import MouseEvent = React.MouseEvent;

import {StoreStructure, TableSession as TableSessionType} from '../interfaces/store-models';
import {PropsExtendedByConnect} from '../interfaces/component';

interface Props {
  session?: TableSessionType;
}

interface State {
  isFormatOfMinutes: boolean;
}

interface MappedProps {}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isFormatOfMinutes: false
    };
  }

  onSessionInfoClick = (event: MouseEvent<HTMLDivElement>) => {
    this.setState({
      isFormatOfMinutes: !this.state.isFormatOfMinutes
    });
  };

  static getDurationString(durationSeconds: number, isFormatOfMinutes: boolean): string {
    const duration = moment.duration({seconds: durationSeconds});

    if (isFormatOfMinutes) {
      return `${duration.asMinutes()}m`;
    } else {
      return moment.utc({
        hours: duration.hours(),
        minutes: duration.minutes()
      })
        .format('H[h] mm[m]');
    }
  }

  render() {
    const session = this.props.session;

    if (session) {
      const {durationSeconds, startsAt, adminEdited} = session;
      const finishTime = moment.utc(startsAt)
        .add({
          seconds: durationSeconds
        })
        .format('hh:mm');
      const adminEditedClassName = adminEdited ? 'table__session-length_admin-edited' : '';
      const durationString = Component.getDurationString(durationSeconds, this.state.isFormatOfMinutes);

      return (
        <div
            className="table__session-info"
            onClick={this.onSessionInfoClick}
        >
          <span className="table__session-name">Last Session</span>
          <span className="table__session-finish-time">{finishTime}</span>
          <span className={`table__session-length ${adminEditedClassName}`}>{durationString}</span>
        </div>
      );
    } else {
      return (
        <div className="table__session-info">
          <div className="table__label table__label_role_no-session">No Sessions Today</div>
        </div>
      );
    }
  }
}

const TableSession = connect<any, any, Props>(
  (state: StoreStructure, ownProps: Props): MappedProps => {
    return {};
  }
)(Component);

export default TableSession;
