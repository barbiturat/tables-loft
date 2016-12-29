import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import * as moment from 'moment';

import {urlTables} from '../../src/constants/urls';
import {ResponseTablesPayload} from '../../src/interfaces/api-responses';

const tables = (server: Application, bodyParser: RequestHandler) => {
  server.get(urlTables, bodyParser, sendWithTimeout(2000, (req, res) => {

    const response: ResponseTablesPayload = {
      tables: [
        {
          name: 'firstPoolTable',
          id: 12,
          tableType: 'pool',
          status: 'active',
          currentSession: {
            id: 5433,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 5433,
            starts_at: moment().utc().subtract({
              hours: 4,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          }
        },
        {
          name: 'otherPoolTable',
          id: 53,
          tableType: 'pool',
          status: 'ready',
          currentSession: null,
          lastSession: {
            id: 77,
            starts_at: moment().utc().subtract({
              hours: 5,
              minutes: 11,
              seconds: 0,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          }
        }
      ]
    };

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default tables;
