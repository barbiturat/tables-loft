import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { compose, withHandlers, withState } from 'recompose';
import * as R from 'ramda';

import { StoreStructure } from '../interfaces/store-models';

interface Props {
  readonly isActive: boolean;
  readonly startsAt?: number;
}

interface MappedProps {
  readonly utcMilliseconds: number;
}

const getDurationActivityString = (
  isFormatOfMinutes: boolean,
  utcMilliseconds: number,
  startsAt?: number
): string => {
  if (!startsAt || !utcMilliseconds) {
    return 'Wrong Parameters!';
  }

  const utcMillisecondsFixed = Math.max(startsAt, utcMilliseconds);
  const durationMs = utcMillisecondsFixed - startsAt;

  if (isFormatOfMinutes) {
    const duration = moment.duration(durationMs);
    const minutes = Math.floor(duration.asMinutes());

    return `${minutes}m`;
  } else {
    return moment.utc(durationMs).format('H[h] mm[m] ss[s]');
  }
};

const enhance = compose(
  withState('isFormatOfMinutes', 'setFormatOfMinutes', false),
  withHandlers({
    onClick: ({ isFormatOfMinutes, setFormatOfMinutes }) => () =>
      setFormatOfMinutes(isFormatOfMinutes)
  })
);

const Component = enhance(
  ({ isActive, isFormatOfMinutes, utcMilliseconds, startsAt, onClick }: any) => {
    const getIsAvailable = () => !isActive;
    const getLabelAvailableText = R.ifElse(
      getIsAvailable,
      R.always('Available'),
      R.partial(getDurationActivityString, [isFormatOfMinutes, utcMilliseconds, startsAt])
    );
    const getAvailabilityClass = R.ifElse(
      getIsAvailable,
      R.always('table__label table__label_role_availability'),
      R.always('table__label table__label_role_counter')
    );

    return (
      <div className={getAvailabilityClass(null)} onClick={onClick}>
        {getLabelAvailableText(null)}
      </div>
    );
  }
);

const TableTimer = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {
    utcMilliseconds: state.app.utcMilliseconds
  };
})(Component);

export default TableTimer;
