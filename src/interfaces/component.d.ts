import {Dispatch} from 'redux';
import {RouteComponentProps} from 'react-router';

import {SimpleAction} from './actions';

export interface BaseComponentProps extends RouteComponentProps<{}, {}> {
  dispatch: Dispatch<SimpleAction>;
}

interface DefaultDispatchProps {
  dispatch: Dispatch<SimpleAction>;
}

type PropsExtendedByConnect<OwnProps, MappedProps> = OwnProps & MappedProps & DefaultDispatchProps;

