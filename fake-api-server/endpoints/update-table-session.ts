import * as bodyParser from 'body-parser';

import sendWithTimeout from '../helpers/send-with-timeout';
import { Application, RequestHandler } from 'express-serve-static-core';
import { STATUS_OK } from '../../src/constants/used-http-status-codes';
import { CustomRequest } from '../interfaces/index';
import { RequestUpdateTableSessionPayload } from '../../src/interfaces/api-requests';
import { ResponseUpdateTableSessionPayload } from '../../src/interfaces/api-responses';
import { urlUpdateTableSession } from '../../src/constants/urls';

const updateTableSession = (server: Application) => {
  server.use(bodyParser.urlencoded({ extended: false })).patch(
    urlUpdateTableSession,
    sendWithTimeout(
      500,
      (req: CustomRequest<RequestUpdateTableSessionPayload, any, any>, res) => {
        const response: ResponseUpdateTableSessionPayload = {};

        res.status(STATUS_OK).send(response);
      }
    )
  );
};

export default updateTableSession;
