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
            hours: 5,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 63499,
          starts_at: moment().utc().subtract({
            hours: 6,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 555857,
          starts_at: moment().utc().subtract({
            hours: 7,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 3966664,
          starts_at: moment().utc().subtract({
            hours: 8,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 5433398,
          starts_at: moment().utc().subtract({
            hours: 9,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 40577,
          starts_at: moment().utc().subtract({
            hours: 10,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: true
        },
        {
          id: 559349,
          starts_at: moment().utc().subtract({
            hours: 11,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 544599,
          starts_at: moment().utc().subtract({
            hours: 12,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 9994651,
          starts_at: moment().utc().subtract({
            hours: 13,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 8498,
          starts_at: moment().utc().subtract({
            hours: 14,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 6540002,
          starts_at: moment().utc().subtract({
            hours: 15,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 9544777,
          starts_at: moment().utc().subtract({
            hours: 16,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 750909,
          starts_at: moment().utc().subtract({
            hours: 17,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 4345088,
          starts_at: moment().utc().subtract({
            hours: 18,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 876000565,
          starts_at: moment().utc().subtract({
            hours: 19,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 5449,
          starts_at: moment().utc().subtract({
            hours: 19,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 2239777,
          starts_at: moment().utc().subtract({
            hours: 20,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 65432229,
          starts_at: moment().utc().subtract({
            hours: 21,
            minutes: 24,
            seconds: 37,
          }).toISOString(),
          durationSeconds: moment.duration(1, 'hours').asSeconds(),
          adminEdited: false
        },
        {
          id: 75433337,
          starts_at: moment().utc().subtract({
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
