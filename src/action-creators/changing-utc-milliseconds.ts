import { BaseAction } from 'redux-actions';

import { UPDATING_UTC_MILLISECONDS } from '../constants/action-names';

const changingUtcMilliseconds: BaseAction = {
  type: UPDATING_UTC_MILLISECONDS
};

export default changingUtcMilliseconds;
