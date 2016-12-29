import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import {CustomRequest} from '../interfaces/index';
import {RequestGetAdminTokenPayload} from '../../src/interfaces/api-requests';
import {ResponseGetAdminTokenPayload} from '../../src/interfaces/api-responses';
import {urlAdminToken} from '../../src/constants/urls';

const getAdminToken = (server: Application, bodyParser: RequestHandler) => {
  server.post(urlAdminToken, bodyParser, sendWithTimeout(500, (req: CustomRequest<RequestGetAdminTokenPayload>, res) => {

    const response: ResponseGetAdminTokenPayload = {
      accessToken: 'someToken'
    };

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default getAdminToken;
