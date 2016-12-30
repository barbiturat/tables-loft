import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import * as moment from 'moment';

import {ResponseStartTablePayload} from '../../src/interfaces/api-responses';
import {urlStartTable} from '../../src/constants/urls';

const startTable = (server: Application, bodyParser: RequestHandler) => {
  server.post(urlStartTable, bodyParser, sendWithTimeout(2500, (req, res) => {

    const response: ResponseStartTablePayload = {
      session: {
        id: req.params.table_id,
        starts_at: moment().utc().toISOString(),
        durationSeconds: moment.duration(1, 'hours').asSeconds(),
        adminEdited: false
      }
    };

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default startTable;
