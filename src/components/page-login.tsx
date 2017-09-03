import * as React from 'react';
import { connect } from 'react-redux';
import { Control, Form, Errors } from 'react-redux-form';
import * as isEmail from 'validator/lib/isEmail';

import { StringDict } from '../interfaces';
import { isNotEmpty as isFilled } from '../helpers';
import { renderErrorComponent, renderErrorsBlock } from '../helpers/renderers';
import { isRequiredField } from '../constants/messages';
import { PropsExtendedByConnect } from '../interfaces/component';
import { LoginForm } from '../interfaces/forms';
import requestingLogin from '../action-creators/requesting-login';
import { loginForm as loginFormField } from '../constants/form-fields';
import { StoreStructure } from '../interfaces/store-models';
import { withHandlers } from 'recompose';
import * as R from 'ramda';

interface Props {}

interface MappedProps {
  readonly loginForm: LoginForm;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

const { validators: { email: emailChecks, password: passwordChecks } } = loginFormField;

const getWaitMessage = (isPending: boolean) =>
  isPending ? <div className="form-message form-message_type_wait">Wait...</div> : null;

const enhance = withHandlers({
  handleSubmit: (props: PropsFromConnect) => (formModelData: StringDict) =>
    R.compose(props.dispatch, requestingLogin)('formsData.loginForm', formModelData)
});

const PageLogin = enhance(
  ({ loginForm, handleSubmit }: PropsFromConnect & { readonly handleSubmit: any }) =>
    <div>
      <Form model="formsData.loginForm" onSubmit={handleSubmit}>
        {getWaitMessage(loginForm.$form.pending)}
        <label className="form-label">
          Email:
          <Control.text
            model=".email"
            validateOn="blur"
            validators={{
              [emailChecks.isEmail]: isEmail,
              [emailChecks.isFilled]: isFilled,
              [emailChecks.isRegistered]: () => true
            }}
          />
          <Errors
            model=".email"
            messages={{
              isEmail: 'Please provide an email address.',
              isFilled: isRequiredField,
              isRegistered: 'This email is not registered'
            }}
            show={{ touched: true, focus: false }}
            wrapper={renderErrorsBlock}
            component={renderErrorComponent}
          />
        </label>

        <label className="form-label">
          Password:
          <Control
            type="password"
            model=".password"
            validators={{
              [passwordChecks.isFilled]: isFilled,
              [passwordChecks.isCorrect]: () => true
            }}
          />
          <Errors
            model=".password"
            messages={{
              isFilled: isRequiredField,
              isCorrect: 'Password is wrong'
            }}
            show={{ touched: true, focus: false }}
            wrapper={renderErrorsBlock}
            component={renderErrorComponent}
          />
        </label>

        <input type="submit" value="submit" />
      </Form>
    </div>
);

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    loginForm: state.formsData.forms.loginForm
  };
};

export default connect(mapStateToProps)(PageLogin);
