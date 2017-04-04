import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import * as moment from 'moment';
import * as bodyParser from 'body-parser';

import {ResponseStopTablePayload} from '../../src/interfaces/api-responses';
import {urlStopTable} from '../../src/constants/urls';

const stopTable = (server: Application) => {
  server
    .use(bodyParser.json())
    .post(urlStopTable, sendWithTimeout(500, (req, res) => {

    const pastTime = {
      hours: 0,
      minutes: 15,
      seconds: 0,
    };

    const response: ResponseStopTablePayload = {
      session: {
        id: 10,
        startsAt: moment().utc().subtract(pastTime).toISOString(),
        durationSeconds: moment.duration(pastTime).asSeconds(),
        adminEdited: false
      }
    };

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default stopTable;
