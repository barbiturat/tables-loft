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
          name: 'Pool Table 1',
          id: 100,
          tableType: 'pool',
          status: 'ready',
          currentSession: {
            id: 10,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 11,
            starts_at: moment().utc().subtract({
              hours: 4,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Pool Table 2',
          id: 101,
          tableType: 'pool',
          status: 'active',
          currentSession: {
            id: 12,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 33,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          }
          ,
          lastSession: {
            id: 13,
            starts_at: moment().utc().subtract({
              hours: 7,
              minutes: 11,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          }
        },
        {
          name: 'Pool Table 3',
          id: 102,
          tableType: 'pool',
          status: 'disabled',
          currentSession: {
            id: 14,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: true
          },
          lastSession: null
        },


        {
          name: 'Shuffle Table 1',
          id: 103,
          tableType: 'shuffleBoard',
          status: 'ready',
          currentSession: {
            id: 15,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 16,
            starts_at: moment().utc().subtract({
              hours: 6,
              minutes: 55,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Shuffle Table 2',
          id: 104,
          tableType: 'shuffleBoard',
          status: 'active',
          currentSession: {
            id: 166,
            starts_at: moment().utc().subtract({
              hours: 2,
              minutes: 2,
              seconds: 33,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 17,
            starts_at: moment().utc().subtract({
              hours: 3,
              minutes: 4,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          }
        },
        {
          name: 'Shuffle Table 3',
          id: 105,
          tableType: 'shuffleBoard',
          status: 'disabled',
          currentSession: {
            id: 18,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: true
          },
          lastSession: null
        },


        {
          name: 'Tennis Table 1',
          id: 106,
          tableType: 'tableTennis',
          status: 'ready',
          currentSession: {
            id: 19,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 20,
            starts_at: moment().utc().subtract({
              hours: 2,
              minutes: 44,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Tennis Table 2',
          id: 107,
          tableType: 'tableTennis',
          status: 'active',
          currentSession: {
            id: 21,
            starts_at: moment().utc().subtract({
              hours: 7,
              minutes: 45,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: null
        },
        {
          name: 'Tennis Table 3',
          id: 108,
          tableType: 'tableTennis',
          status: 'disabled',
          currentSession: {
            id: 22,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: true
          },
          lastSession: null
        },


        {
          name: 'Generic Table 1',
          id: 109,
          tableType: 'generic',
          status: 'ready',
          currentSession: {
            id: 23,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 24,
            starts_at: moment().utc().subtract({
              hours: 4,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Generic Table 2',
          id: 110,
          tableType: 'generic',
          status: 'active',
          currentSession: {
            id: 244,
            starts_at: moment().utc().subtract({
              hours: 9,
              minutes: 55,
              seconds: 44,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 25,
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
          name: 'Generic Table 3',
          id: 111,
          tableType: 'generic',
          status: 'disabled',
          currentSession: {
            id: 26,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
              seconds: 37,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: true
          },
          lastSession: null
        }
      ]
    };

    res
      .status(STATUS_OK)
      .send(response);

  }));
};

export default tables;
