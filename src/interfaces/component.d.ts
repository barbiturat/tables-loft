import { Dispatch } from 'redux';
import { BaseAction } from 'redux-actions';

interface DefaultDispatchProps {
  readonly dispatch: Dispatch<BaseAction>;
}

type PropsExtendedByConnect<OwnProps, MappedProps> = OwnProps & MappedProps & DefaultDispatchProps;
