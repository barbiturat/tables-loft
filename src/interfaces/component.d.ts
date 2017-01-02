import {Dispatch} from 'redux';
import {RouteComponentProps} from 'react-router';

import {SimpleAction} from './actions';

interface DefaultDispatchProps {
  dispatch: Dispatch<SimpleAction>;
}

type PropsExtendedByConnect<OwnProps, MappedProps> = OwnProps & MappedProps & DefaultDispatchProps;

