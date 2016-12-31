import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import {CustomRequest} from '../interfaces/index';
import {RequestUpdateTableSessionPayload} from '../../src/interfaces/api-requests';
import {ResponseUpdateTableSessionPayload} from '../../src/interfaces/api-responses';
import {urlUpdateTableSession} from '../../src/constants/urls';

const updateTableSession = (server: Application, bodyParser: RequestHandler) => {
  server.post(urlUpdateTableSession, bodyParser, sendWithTimeout(500, (req: CustomRequest<RequestUpdateTableSessionPayload, any>, res) => {

    const response: ResponseUpdateTableSessionPayload = {};

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default updateTableSession;
