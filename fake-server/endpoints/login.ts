import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {CustomRequest} from '../interfaces/index';
import {STATUS_OK, STATUS_FORBIDDEN} from '../../src/constants/used-http-status-codes';
import {SESSION_COOKIE_NAME, responseDefaultOk} from '../constants/index';
import {ResponseLoginFailedPayload} from '../../src/interfaces/api-responses';
import {RequestLoginPayload} from '../../src/interfaces/api-requests';
import {urlLogin} from '../../src/constants/urls';
import {LoginErrors} from '../../src/interfaces/backend-models';

const testUserEmail = 'test@test.ru';
const testUserPassword = 'test';

const login = (server: Application, bodyParser: RequestHandler) => {
  server.post(urlLogin, bodyParser, sendWithTimeout(500, (req: CustomRequest<RequestLoginPayload>, res) => {
    const {email, password} = req.body;

    if (email === testUserEmail && password === testUserPassword) {
      const sessionValue = 'test-session';

      res
        .status(STATUS_OK)
        .cookie(SESSION_COOKIE_NAME, sessionValue, {
          maxAge: 60 * 60 * 1000, // 1 hour
          httpOnly: true
        })
        .send(responseDefaultOk);

    } else {
      const emails: string[] = [testUserEmail];
      const errors: LoginErrors = {
        email: {},
        password: {}
      };

      if (emails.indexOf(email) === -1) {
        errors.email.isRegistered = false;
      } else {
        if (password !== testUserPassword) {
          errors.password.isCorrect = false;
        }
      }

      res
        .status(STATUS_FORBIDDEN)
        .send(<ResponseLoginFailedPayload>{
          errors
        });
    }
  }));
};

export default login;
