import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import * as moment from 'moment';

import {CustomRequest} from '../interfaces/index';
import {RequestSessionHistoryPayload} from '../../src/interfaces/api-requests';
import {ResponseSessionsHistoryPayload} from '../../src/interfaces/api-responses';
import {urlSessionHistory} from '../../src/constants/urls';

const sessionHistory = (server: Application, bodyParser: RequestHandler) => {
  server.get(urlSessionHistory, bodyParser, sendWithTimeout(500, (req: CustomRequest<RequestSessionHistoryPayload, any>, res) => {

    const response: ResponseSessionsHistoryPayload = {
      sessions: [
        {
          id: 5433,
          starts_at: moment().utc().subtract({
            hours: 4,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 567,
          starts_at: moment().utc().subtract({
            hours: 2,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
      ]
    };

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default sessionHistory;
