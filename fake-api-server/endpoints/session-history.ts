import sendWithTimeout from '../helpers/send-with-timeout';
import {Application, RequestHandler} from 'express-serve-static-core';
import {STATUS_OK} from '../../src/constants/used-http-status-codes';
import * as moment from 'moment';
import * as bodyParser from 'body-parser';

import {CustomRequest} from '../interfaces/index';
import {RequestSessionHistoryPayload} from '../../src/interfaces/api-requests';
import {ResponseSessionsHistoryPayload} from '../../src/interfaces/api-responses';
import {urlSessionHistory} from '../../src/constants/urls';

interface Params {
  readonly table_id: any;
}

const sessionHistory = (server: Application) => {
  server
    .use(bodyParser.urlencoded({ extended: false }))
    .get(urlSessionHistory, sendWithTimeout(500, (req: CustomRequest<RequestSessionHistoryPayload, Params, any>, res) => {

    const response: ResponseSessionsHistoryPayload = {
      sessions: [
        {
          id: 5433,
          startsAt: moment().utc().subtract({
            hours: 4,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 567,
          startsAt: moment().utc().subtract({
            hours: 5,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 63499,
          startsAt: moment().utc().subtract({
            hours: 6,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 555857,
          startsAt: moment().utc().subtract({
            hours: 7,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 3966664,
          startsAt: moment().utc().subtract({
            hours: 8,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 5433398,
          startsAt: moment().utc().subtract({
            hours: 9,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 40577,
          startsAt: moment().utc().subtract({
            hours: 10,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 559349,
          startsAt: moment().utc().subtract({
            hours: 11,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 544599,
          startsAt: moment().utc().subtract({
            hours: 12,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 9994651,
          startsAt: moment().utc().subtract({
            hours: 13,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 8498,
          startsAt: moment().utc().subtract({
            hours: 14,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 6540002,
          startsAt: moment().utc().subtract({
            hours: 15,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 9544777,
          startsAt: moment().utc().subtract({
            hours: 16,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 750909,
          startsAt: moment().utc().subtract({
            hours: 17,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 4345088,
          startsAt: moment().utc().subtract({
            hours: 18,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 876000565,
          startsAt: moment().utc().subtract({
            hours: 19,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 5449,
          startsAt: moment().utc().subtract({
            hours: 19,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 2239777,
          startsAt: moment().utc().subtract({
            hours: 20,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 65432229,
          startsAt: moment().utc().subtract({
            hours: 21,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 75433337,
          startsAt: moment().utc().subtract({
            hours: 22,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        }
      ]
    };

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default sessionHistory;
