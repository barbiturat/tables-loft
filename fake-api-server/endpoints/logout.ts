import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import {SESSION_COOKIE_NAME, responseDefaultOk} from '../constants/index';
import {urlLogout} from '../../src/constants/urls';

const logout = (server: Application, bodyParser: RequestHandler) => {
  server.post(urlLogout, bodyParser, sendWithTimeout(500, (req, res) => {
    res
      .clearCookie(SESSION_COOKIE_NAME)
      .status(STATUS_OK)
      .send(responseDefaultOk);
  }));
};

export default logout;
