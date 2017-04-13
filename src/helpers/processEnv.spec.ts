import {getProcessEnv} from './processEnv';

describe('getProcessEnv', () => {
  const origEnv = process.env;

  afterEach(() => {
    process.env = origEnv;
  });

  it('returns process.env data', () => {
    const changedEnv = {
      someField: 555
    };
    process.env = changedEnv;
    const result = getProcessEnv();

    expect(result).toEqual(changedEnv);
  });
});
