import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK, STATUS_FORBIDDEN} from '../../src/constants/used-http-status-codes';
import {CustomRequest} from '../interfaces/index';
import {RequestGetAdminTokenPayload} from '../../src/interfaces/api-requests';
import {ResponseGetAdminTokenPayload, ResponseGetAdminTokenFailedPayload} from '../../src/interfaces/api-responses';
import {urlGetAdminToken} from '../../src/constants/urls';

const getAdminToken = (server: Application, bodyParser: RequestHandler) => {
  server.post(urlGetAdminToken, bodyParser, sendWithTimeout(500, (req: CustomRequest<RequestGetAdminTokenPayload, any>, res) => {

    const response: ResponseGetAdminTokenPayload = {
      accessToken: 'someToken'
    };

    res
      .status(STATUS_OK)
      .send(response);

    /*const response: ResponseGetAdminTokenFailedPayload = {
      errors: {
        password: {
          isCorrect: false
        }
      }
    };

    res
      .status(STATUS_FORBIDDEN)
      .send(response);*/

  }));
};

export default getAdminToken;
