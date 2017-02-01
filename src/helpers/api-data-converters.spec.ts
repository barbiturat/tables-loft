import { expect } from 'chai';
import {pipe, keys, values, pluck} from 'ramda';
import * as moment from 'moment';

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
  it('should be defined', () => {
    expect(tablesToFront).to.exist;
  });

  it(`returns object with keys, based on the source tables ids`, () => {
    const backendTableTemplate = getBackendTableTemplate();

    const firstBackendTable = {...backendTableTemplate, ...{id: 1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 5}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 55}};

    const sourceTables: BackendTable[] = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const resultKeys = keys(resultTables);

    expect(resultKeys).to.be.deep.equal(['1', '5', '55']);
  });

  it(`should not emit result tables with duplicated ids`, () => {
    const backendTableTemplate = getBackendTableTemplate();
    const firstBackendTable = {...backendTableTemplate, ...{id: 1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 5}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 5}};

    const sourceTables: BackendTable[] = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    expect(resultTables).to.have.all.keys('1', '5');
  });

  it(`returns object with same number of keys, as in the source array`, () => {
    const backendTableTemplate = getBackendTableTemplate();
    const firstBackendTable = {...backendTableTemplate, ...{id: 1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 5}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 7}};

    const sourceTables: BackendTable[] = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    expect( Object.keys(resultTables) ).to.have.lengthOf(sourceTables.length);
  });

  it(`returns result tables with currentSessionId === null if corresponding source tables's currentSession === null`, () => {
    const backendTableTemplate = getBackendTableTemplate();
    const backendSessionTemplate = getBackendSessionTemplate();

    const firstBackendTable = {...backendTableTemplate, ...{id: 0, currentSession: backendSessionTemplate}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 1, currentSession: null}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 2, currentSession: backendSessionTemplate}};

    const sourceTables: BackendTable[] = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const currentSessionIds = pipe(
      values,
      pluck('currentSessionId')
    )(resultTables);

    expect(currentSessionIds).to.be.deep.equal([backendSessionTemplate.id, null, backendSessionTemplate.id]);
  });

  it(`returns result tables with lastSessionId === null if corresponding source tables's lastSession === null`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendTableTemplate = getBackendTableTemplate();

    const firstBackendTable = {...backendTableTemplate, ...{id: 0, lastSession: backendSessionTemplate}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 1, lastSession: null}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 2, lastSession: backendSessionTemplate}};

    const sourceTables: BackendTable[] = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const currentSessionIds = pipe(
      values,
      pluck('lastSessionId')
    )(resultTables);

    expect(currentSessionIds).to.be.deep.equal([backendSessionTemplate.id, null, backendSessionTemplate.id]);
  });

  it(`returns result tables with sessionsHistory that contains only ids of currentSession and lastSession`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendTableTemplate = getBackendTableTemplate();

    const currentSession1 = {...backendSessionTemplate, ...{id: 5}};
    const lastSession1 = {...backendSessionTemplate, ...{id: 7}};
    const lastSession2 = {...backendSessionTemplate, ...{id: 55}};

    const firstBackendTable = {...backendTableTemplate, ...{id: 0, currentSession: currentSession1, lastSession: lastSession1}};
    const secondBackendTable = {...backendTableTemplate, ...{id: 1, currentSession: null, lastSession: null}};
    const thirdBackendTable = {...backendTableTemplate, ...{id: 2, currentSession: null, lastSession: lastSession2}};

    const sourceTables: BackendTable[] = [firstBackendTable, secondBackendTable, thirdBackendTable];
    const resultTables = tablesToFront(sourceTables);

    const sessionsHistories = pipe(
      values,
      pluck('sessionsHistory')
    )(resultTables);

    console.log('sessionsHistories', sessionsHistories);

    expect(sessionsHistories).to.be.deep.equal([
      [5, 7],
      [],
      [55]
    ]);
  });
});

describe('tableSessionToFront: ', () => {
  it('should be defined', () => {
    expect(tableSessionToFront).to.exist;
  });

  it(`returns object with "id" which equals to source's "id"`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession = {...backendSessionTemplate, ...{id: 7}};
    const resultSession = tableSessionToFront(sourceSession);

    expect(resultSession).to.contain.keys(['id']);
    expect(resultSession.id).to.be.equal(sourceSession.id);
  });

  it(`returns object with "adminEdited" which equals to source's "adminEdited"`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession: BackendTableSession = {...backendSessionTemplate, ...{adminEdited: true}};
    const resultSession = tableSessionToFront(sourceSession);

    expect(resultSession).to.contain.keys(['adminEdited']);
    expect(resultSession.adminEdited).to.be.equal(sourceSession.adminEdited);
  });

  it(`returns object with "isInPending" === false`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession = {...backendSessionTemplate};
    const resultSession = tableSessionToFront(sourceSession);

    expect(resultSession).to.contain.keys(['isInPending']);
    expect(resultSession.isInPending).to.be.equal(false);
  });

  it(`returns object with "durationSeconds" === 0 if there is no "durationSeconds" in the source object`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession = {...backendSessionTemplate, ...{durationSeconds: null}};
    const resultSession = tableSessionToFront(sourceSession);

    expect(resultSession).to.contain.keys(['durationSeconds']);
    expect(resultSession.durationSeconds).to.be.equal(0);
  });

  it(`returns object with "durationSeconds" which equals to source's "durationSeconds" if it is not null`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const sourceSession: BackendTableSession = {...backendSessionTemplate, ...{durationSeconds: 33}};
    const resultSession = tableSessionToFront(sourceSession);

    expect(resultSession).to.contain.keys(['durationSeconds']);
    expect(resultSession.durationSeconds).to.be.equal(sourceSession.durationSeconds);
  });

  it(`returns object with "startsAt" which equals to number of milliseconds that encoded in the "startsAt" of a source object`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const startsAt = moment().utc().subtract().toISOString();
    const startsAtMs = moment(startsAt, moment.ISO_8601).valueOf();

    const sourceSession: BackendTableSession = {...backendSessionTemplate, ...{startsAt}};
    const resultSession = tableSessionToFront(sourceSession);

    expect(resultSession).to.contain.keys(['startsAt']);
    expect(resultSession.startsAt).to.be.equal(startsAtMs);
  });
});

describe('tableSessionsToFront: ', () => {
  it('should be defined', () => {
    expect(tableSessionsToFront).to.exist;
  });

  it(`returns object with keys from unique ids of the the source array's sessions`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendSession1 = {...backendSessionTemplate, ...{id: 12}};
    const backendSession2 = {...backendSessionTemplate, ...{id: 33}};
    const backendSession3 = {...backendSessionTemplate, ...{id: 12}};

    const sourceSessions: BackendTableSession[] = [backendSession1, backendSession2, backendSession3];
    const result = tableSessionsToFront(sourceSessions);

    expect(result).to.have.all.keys(['12', '33']);
  });

  // создает словарь, значениями которого являются TableSessionFrontend

  it(`returns object with values of "TableSessionFrontend" type`, () => {
    const backendSessionTemplate = getBackendSessionTemplate();
    const backendSession1 = {...backendSessionTemplate, ...{id: 12}};
    const backendSession2 = {...backendSessionTemplate, ...{id: 33}};
    const backendSession3 = {...backendSessionTemplate, ...{id: 77}};

    const sourceSessions: BackendTableSession[] = [backendSession1, backendSession2, backendSession3];
    const result = tableSessionsToFront(sourceSessions);
    const exampleSession: FrontendTableSession = result[33];

    expect(exampleSession).to.have.all.keys(['id', 'startsAt', 'durationSeconds', 'adminEdited', 'isInPending']);
    expect(exampleSession.id).to.be.a('number');
    expect(exampleSession.id).not.to.be.NaN;
    expect(exampleSession.startsAt).to.be.a('number');
    expect(exampleSession.startsAt).not.to.be.NaN;
    expect(exampleSession.durationSeconds).to.be.a('number');
    expect(exampleSession.durationSeconds).not.to.be.NaN;
    expect(exampleSession.adminEdited).to.be.a('boolean');
    expect(exampleSession.isInPending).to.be.a('boolean');
  });
});


