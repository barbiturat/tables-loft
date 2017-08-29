import * as React from 'react';
import { withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import MouseEvent = React.MouseEvent;
import ReactModal from 'react-modal';
import {
  Control,
  Form,
  Errors,
  actions,
  ErrorsProps,
  WrapperProps,
  CustomComponentProps
} from 'react-redux-form';

import { StoreStructure } from '../interfaces/store-models';
import { PropsExtendedByConnect } from '../interfaces/component';
import { managerLoginForm } from '../constants/form-fields';
import { ManagerLoginForm } from '../interfaces/forms';
import { isRequiredField } from '../constants/messages';
import { isNotEmpty as isFilled } from '../helpers';
import { StringDict } from '../interfaces/index';
import requestingManagerLogin from '../action-creators/requesting-admin-token';
import * as R from 'ramda';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface MappedProps {
  readonly managerLoginForm: ManagerLoginForm;
  readonly pending: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const { validators: { password: passwordChecks } } = managerLoginForm;

const WaitMessage = ({ isPending }: { readonly isPending: boolean }) =>
  isPending ? <div>Wait...</div> : null;

const ErrorsBlock: React.StatelessComponent<
  ErrorsProps & WrapperProps
> = props =>
  <div className="modal__form-errors">
    {props.children}
  </div>;

const ErrorComponent: React.StatelessComponent<
  ErrorsProps & CustomComponentProps
> = props =>
  <div className="modal__form-error">
    {props.children}
  </div>;

type Handlers = {
  readonly resetPasswordInput: () => void;
  readonly handleSubmit: (formModelData: StringDict) => void;
  readonly requestToClose: () => void;
  readonly onCloseClick: () => void;
  readonly handleRequestCloseFunc: () => void;
};

const HandlersComponent = compose(
  withHandlers({
    resetPasswordInput: ({ dispatch }) => () => {
      dispatch(actions.change('formsData.managerLoginForm.password', ''));
      dispatch(actions.setInitial('formsData.managerLoginForm.password'));
    },
    handleSubmit: ({ dispatch }) => (formModelData: StringDict) => {
      R.compose(dispatch, requestingManagerLogin)(
        'formsData.managerLoginForm',
        formModelData
      );
    }
  }),
  withHandlers({
    requestToClose: ({ resetPasswordInput, onClose }: any) => () => {
      resetPasswordInput();
      onClose();
    }
  }),
  withHandlers({
    onCloseClick: ({ requestToClose }: any) => (
      event: MouseEvent<HTMLAnchorElement>
    ) => {
      event.preventDefault();
      requestToClose();
    },
    handleRequestCloseFunc: ({ requestToClose }: any) => () => {
      requestToClose();
    }
  })
);

const Component = HandlersComponent(
  ({
    isOpen,
    pending,
    handleRequestCloseFunc,
    onCloseClick,
    handleSubmit
  }: PropsFromConnect & Handlers) =>
    <ReactModal
      contentLabel="Admin Login"
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleRequestCloseFunc}
      className="modal modal_role_login-manager"
      overlayClassName="modal__overlay"
    >
      <a className="modal__button-close" href="" onClick={onCloseClick} />
      <div className="modal__header">
        <h3 className="modal__header-caption">Manager Mode</h3>
      </div>
      <h4 className="modal__description">
        Type password to enter manager mode
      </h4>

      <WaitMessage isPending={pending} />

      <Form
        className="modal__form modal__form_role_login"
        model="formsData.managerLoginForm"
        onSubmit={handleSubmit}
      >
        <label className="form-label form-label_type_big form-label_role_password modal_adjust_form-label">
          <Control
            type="password"
            className="input input_type_big input_role_manager-password"
            autoComplete="false"
            autoFocus={true}
            model=".password"
            validators={{
              [passwordChecks.isFilled]: isFilled,
              [passwordChecks.isCorrect]: () => true
            }}
          />
        </label>

        <Errors
          model=".password"
          messages={{
            isFilled: isRequiredField,
            isCorrect: 'Password is wrong'
          }}
          show={{ touched: true }}
          wrapper={ErrorsBlock}
          component={ErrorComponent}
        />

        <div className="modal__buttons-group">
          <input
            type="submit"
            value="Login"
            className="button button_type_modal-big"
          />
        </div>
      </Form>
    </ReactModal>
);

const ModalAdminLogin = connect<
  any,
  any,
  Props
>((state: StoreStructure, ownProps: Props): MappedProps => {
  return {
    managerLoginForm: state.formsData.forms.managerLoginForm,
    pending: state.formsData.forms.managerLoginForm.$form.pending
  };
})(Component);

export default ModalAdminLogin;
