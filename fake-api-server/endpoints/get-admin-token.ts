import * as bodyParser from 'body-parser';

import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK, STATUS_UNPROCESSABLE_ENTITY} from '../../src/constants/used-http-status-codes';
import {CustomRequest} from '../interfaces/index';
import {RequestGetAdminTokenPayload} from '../../src/interfaces/api-requests';
import {ResponseGetAdminTokenPayload, ResponseGetAdminTokenFailedPayload} from '../../src/interfaces/api-responses';
import {urlGetAdminToken} from '../../src/constants/urls';

const getAdminToken = (server: Application) => {
  server
    .use(bodyParser.json())
    .post(urlGetAdminToken, sendWithTimeout(500, (req: CustomRequest<RequestGetAdminTokenPayload, any, any>, res) => {

    if (req.body.password === 'qqq') {
      const response: ResponseGetAdminTokenPayload = {
        adminToken: 'someToken'
      };

      res
        .status(STATUS_OK)
        .send(response);
    } else {
      const response: ResponseGetAdminTokenFailedPayload = {
        errors: {
          password: {
            isCorrect: false
          }
        }
      };

      res
        .status(STATUS_UNPROCESSABLE_ENTITY)
        .send(response);
    }

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
