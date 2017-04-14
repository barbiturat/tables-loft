import {pipe, keys, values, pluck, intersection} from 'ramda';
import * as moment from 'moment';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./testing/jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

import {tablesToFront, tableSessionsToFront, tableSessionToFront} from './api-data-converters';
import {Table as BackendTable, TableSession as BackendTableSession} from '../interfaces/backend-models';
import {Table as FrontendTable, TableSession as FrontendTableSession} from '../interfaces/store-models';

const getBackendSessionTemplate = (): BackendTableSession => ({
  id: 12,
  startsAt: moment().utc().subtract().toISOString(),
  durationSeconds: 555,
  adminEdited: false
});

const getBackendTableTemplate = (): BackendTable => ({
  name: 'first',
  id: 1,
  tableType: 'pool',
  status: 'enabled',
  currentSession: {
    id: 12,
    startsAt: '1111',
    durationSeconds: 555,
    adminEdited: false
  },
  lastSession: {
    id: 14,
    startsAt: '1111',
    durationSeconds: 555,
    adminEdited: false
  }
});

describe('tablesToFront: ', () => {
  jsc.property('test of jsverify', jsc.integer(5, 20), b => b < 21);

  test('should be defined', () => {
    expect(tablesToFront).toBeDefined();

    // const property = jsc.forall('integer', function (n) {
    //   return n < 22;
    // });
    //
    // jsc.assert(property);
  });

  test(`returns object with keys, based on the source tables ids`, () => {
    const backendTableTemplate = getBackendTableTemplate();

    const firstBackendTable = {...backendTableTemplate, ...{id: 1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 5}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 55}};

    const sourceTables: ReadonlyArray<BackendTable> = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const resultKeys = keys(resultTables);

    expect(resultKeys).toEqual(['1', '5', '55']);
  });

  test(`should not emit result tables with duplicated ids`, () => {
    const backendTableTemplate = getBackendTableTemplate();
    const firstBackendTable = {...backendTableTemplate, ...{id: 1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 5}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 5}};

    const sourceTables: ReadonlyArray<BackendTable> = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    expect( Object.keys(resultTables) ).toEqual(['1', '5']);
  });

  test(`returns object with same number of keys, as in the source array`, () => {
    const backendTableTemplate = getBackendTableTemplate();
    const firstBackendTable = {...backendTableTemplate, ...{id: 1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 5}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 7}};

    const sourceTables: ReadonlyArray<BackendTable> = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    expect( Object.keys(resultTables).length ).toBe(sourceTables.length);
  });

  test(`returns result tables with currentSessionId === null if corresponding source tables's currentSession === null`, () => {
    const backendTableTemplate = getBackendTableTemplate();
    const backendSessionTemplate = getBackendSessionTemplate();

    const firstBackendTable = {...backendTableTemplate, ...{id: 0, currentSession: backendSessionTemplate}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 1, currentSession: null}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 2, currentSession: backendSessionTemplate}};

    const sourceTables: ReadonlyArray<BackendTable> = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const currentSessionIds = pipe(
      values,
      pluck('currentSessionId')
    )(resultTables);

    expect(currentSessionIds).toEqual([backendSessionTemplate.id, null, backendSessionTemplate.id]);
  });

  test(`returns result tables with lastSessionId === null if corresponding source tables's lastSession === null`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendTableTemplate = getBackendTableTemplate();

    const firstBackendTable = {...backendTableTemplate, ...{id: 0, lastSession: backendSessionTemplate}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 1, lastSession: null}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 2, lastSession: backendSessionTemplate}};

    const sourceTables: ReadonlyArray<BackendTable> = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const currentSessionIds = pipe(
      values,
      pluck('lastSessionId')
    )(resultTables);

    expect(currentSessionIds).toEqual([backendSessionTemplate.id, null, backendSessionTemplate.id]);
  });

  test(`returns result tables with sessionsHistory that contains only ids of currentSession and lastSession`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendTableTemplate = getBackendTableTemplate();

    const currentSession1 = {...backendSessionTemplate, ...{id: 5}};
    const lastSession1 = {...backendSessionTemplate, ...{id: 7}};
    const lastSession2 = {...backendSessionTemplate, ...{id: 55}};

    const firstBackendTable = {...backendTableTemplate, ...{id: 0, currentSession: currentSession1, lastSession: lastSession1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 1, currentSession: null, lastSession: null}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 2, currentSession: null, lastSession: lastSession2}};

    const sourceTables: ReadonlyArray<BackendTable> = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const sessionsHistories = pipe(
      values,
      pluck('sessionsHistory')
    )(resultTables);

    expect(sessionsHistories).toEqual([
      [5, 7],
      [],
      [55]
    ]);
  });
});

describe('tableSessionToFront: ', () => {
  test('should be defined', () => {
    expect(tableSessionToFront).toBeDefined();
  });

  test(`returns object with "id" which equals to source's "id"`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession = {...backendSessionTemplate, ...{id: 7}};
    const resultSession = tableSessionToFront(sourceSession);

    expect( Object.keys(resultSession) ).toContain('id');
    expect(resultSession.id).toBe(sourceSession.id);
  });

  test(`returns object with "adminEdited" which equals to source's "adminEdited"`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession: BackendTableSession = {...backendSessionTemplate, ...{adminEdited: true}};
    const resultSession = tableSessionToFront(sourceSession);

    expect( Object.keys(resultSession) ).toContain('adminEdited');
    expect(resultSession.adminEdited).toBe(sourceSession.adminEdited);
  });

  test(`returns object with "isInPending" === false`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession = {...backendSessionTemplate};
    const resultSession = tableSessionToFront(sourceSession);

    expect( Object.keys(resultSession) ).toContain('isInPending');
    expect(resultSession.isInPending).toBe(false);
  });

  test(`returns object with "durationSeconds" === 0 if there is no "durationSeconds" in the source object`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession = {...backendSessionTemplate, ...{durationSeconds: null}};
    const resultSession = tableSessionToFront(sourceSession);

    expect( Object.keys(resultSession) ).toContain('durationSeconds');
    expect(resultSession.durationSeconds).toBe(0);
  });

  test(`returns object with "durationSeconds" which equals to source's "durationSeconds" if it is not null`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession: BackendTableSession = {...backendSessionTemplate, ...{durationSeconds: 33}};
    const resultSession = tableSessionToFront(sourceSession);

    expect( Object.keys(resultSession) ).toContain('durationSeconds');
    expect(resultSession.durationSeconds).toBe(sourceSession.durationSeconds);
  });

  test(`returns object with "startsAt" which equals to number of milliseconds that encoded in the "startsAt" of a source object`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const startsAt = moment().utc().subtract().toISOString();
    const startsAtMs = moment(startsAt, moment.ISO_8601).valueOf();

    const sourceSession: BackendTableSession = {...backendSessionTemplate, ...{startsAt}};
    const resultSession = tableSessionToFront(sourceSession);

    expect( Object.keys(resultSession) ).toContain('startsAt');
    expect(resultSession.startsAt).toBe(startsAtMs);
  });
});

describe('tableSessionsToFront: ', () => {
  test('should be defined', () => {
    expect(tableSessionsToFront).toBeDefined();
  });

  test(`returns object with keys from unique ids of the the source array's sessions`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendSession1 = {...backendSessionTemplate, ...{id: 12}};
    const backendSession2 = {...backendSessionTemplate, ...{id: 33}};
    const backendSession3 = {...backendSessionTemplate, ...{id: 12}};

    const sourceSessions: ReadonlyArray<BackendTableSession> = [backendSession1, backendSession2, backendSession3];
    const result = tableSessionsToFront(sourceSessions);
    const goalValues = ['12', '33'];

    const valuesIntersection = intersection<string>( Object.keys(result) , goalValues);

    expect(valuesIntersection.length).toEqual(goalValues.length);
  });

  // создает словарь, значениями которого являются TableSessionFrontend

  test(`returns object with values of "TableSessionFrontend" type`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendSession1 = {...backendSessionTemplate, ...{id: 12}};
    const backendSession2 = {...backendSessionTemplate, ...{id: 33}};
    const backendSession3 = {...backendSessionTemplate, ...{id: 77}};

    const sourceSessions: ReadonlyArray<BackendTableSession> = [backendSession1, backendSession2, backendSession3];
    const result = tableSessionsToFront(sourceSessions);
    const exampleSession: FrontendTableSession = result[33];

    const goalValues = ['id', 'startsAt', 'durationSeconds', 'adminEdited', 'isInPending'];
    const valuesIntersection = intersection<string>( Object.keys(exampleSession) , goalValues);

    expect(valuesIntersection.length).toEqual(goalValues.length);
    expect(typeof exampleSession.id).toBe('number');
    expect( isNaN(exampleSession.id) ).toBeFalsy();
    expect(typeof exampleSession.startsAt).toBe('number');
    expect( isNaN(exampleSession.startsAt) ).toBeFalsy();
    expect(typeof exampleSession.durationSeconds).toBe('number');
    expect( isNaN(exampleSession.durationSeconds) ).toBeFalsy();
    expect(typeof exampleSession.adminEdited).toBe('boolean');
    expect(typeof exampleSession.isInPending).toBe('boolean');
  });
});


