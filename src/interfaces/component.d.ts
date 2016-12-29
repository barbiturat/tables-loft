import {Dispatch} from 'redux';
import {RouteComponentProps} from 'react-router';

import {SimpleAction} from './actions';

export interface BaseComponentProps extends RouteComponentProps<{}, {}> {
  dispatch: Dispatch<SimpleAction>;
}
