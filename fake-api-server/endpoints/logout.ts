import * as bodyParser from 'body-parser';

import sendWithTimeout from '../helpers/send-with-timeout';
import { Application, RequestHandler } from 'express-serve-static-core';
import { STATUS_OK } from '../../src/constants/used-http-status-codes';
import { SESSION_COOKIE_NAME, responseDefaultOk } from '../constants/index';
import { urlLogout } from '../../src/constants/urls';

const logout = (server: Application) => {
  server.use(bodyParser.json()).post(
    urlLogout,
    sendWithTimeout(500, (req, res) => {
      res
        .clearCookie(SESSION_COOKIE_NAME)
        .status(STATUS_OK)
        .send(responseDefaultOk);
    })
  );
};

export default logout;
