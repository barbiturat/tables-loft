import {TestScheduler} from 'rxjs';
import {Arbitrary} from 'jsverify';
import {equals} from 'ramda';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

type TestPropertyHandler = (propertyScheduler: TestScheduler, ...args: any[]) => void;

export function testProperty(description: string, arbitrary1: Arbitrary<any>, handler: TestPropertyHandler): void {
  const innerHandler = () => {
    let areEqual = false;
    const propertyScheduler = new TestScheduler((actual: any, expected: any) => {
      areEqual = equals(actual)(expected);

      if (!areEqual) {
        // to have a verbose information about marble test error
        return expect(actual).toEqual(expected);
      }

      return areEqual;
    });

    handler(propertyScheduler, arbitrary1);

    propertyScheduler.flush();
    return areEqual;
  };

  jsc.property(description, arbitrary1, innerHandler);
}
