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
          status: 'enabled',
          currentSession: {
            id: 10,
            starts_at: moment().utc().subtract({
              hours: 1,
              minutes: 24,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: true
          },
          lastSession: {
            id: 11,
            starts_at: moment().utc().subtract({
              hours: 4,
              minutes: 11,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Pool Table 2',
          id: 101,
          tableType: 'pool',
          status: 'enabled',
          currentSession: {
            id: 12,
            starts_at: moment().utc().subtract({
              hours: 2,
              minutes: 33,
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
              hours: 3,
              minutes: 56,
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
          status: 'enabled',
          currentSession: {
            id: 15,
            starts_at: moment().utc().subtract({
              hours: 4,
              minutes: 43,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 16,
            starts_at: moment().utc().subtract({
              hours: 6,
              minutes: 55,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Shuffle Table 2',
          id: 104,
          tableType: 'shuffleBoard',
          status: 'enabled',
          currentSession: {
            id: 166,
            starts_at: moment().utc().subtract({
              hours: 0,
              minutes: 2,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 17,
            starts_at: moment().utc().subtract({
              hours: 3,
              minutes: 4,
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
              minutes: 38,
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
          status: 'enabled',
          currentSession: {
            id: 19,
            starts_at: moment().utc().subtract({
              hours: 2,
              minutes: 18,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 20,
            starts_at: moment().utc().subtract({
              hours: 2,
              minutes: 44,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Tennis Table 2',
          id: 107,
          tableType: 'tableTennis',
          status: 'enabled',
          currentSession: {
            id: 21,
            starts_at: moment().utc().subtract({
              hours: 3,
              minutes: 45,
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
              hours: 4,
              minutes: 48,
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
          status: 'enabled',
          currentSession: {
            id: 23,
            starts_at: moment().utc().subtract({
              hours: 5,
              minutes: 7,
            }).toISOString(),
            durationSeconds: moment.duration(2, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 24,
            starts_at: moment().utc().subtract({
              hours: 4,
              minutes: 53,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: true
          }
        },
        {
          name: 'Generic Table 2',
          id: 110,
          tableType: 'generic',
          status: 'enabled',
          currentSession: {
            id: 244,
            starts_at: moment().utc().subtract({
              hours: 9,
              minutes: 55,
            }).toISOString(),
            durationSeconds: moment.duration(1, 'hours').asSeconds(),
            adminEdited: false
          },
          lastSession: {
            id: 25,
            starts_at: moment().utc().subtract({
              hours: 4,
              minutes: 33,
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
              hours: 6,
              minutes: 21,
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
