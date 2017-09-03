import { TestScheduler } from 'rxjs';
import { Arbitrary } from 'jsverify';
import { equals } from 'ramda';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

type TestPropertyHandler = (propertyScheduler: TestScheduler, ...args: ReadonlyArray<any>) => void;

export function testObservableProperty(
  description: string,
  arbitrary1: Arbitrary<any>,
  handler: TestPropertyHandler
): void;
export function testObservableProperty(
  description: string,
  arbitrary1: Arbitrary<any>,
  arbitrary2: Arbitrary<any>,
  handler: TestPropertyHandler
): void;
export function testObservableProperty(
  description: string,
  arbitrary1: Arbitrary<any>,
  arbitrary2: Arbitrary<any>,
  arbitrary3: Arbitrary<any>,
  handler: TestPropertyHandler
): void;
export function testObservableProperty(
  description: string,
  arbitrary1: Arbitrary<any>,
  ...other: ReadonlyArray<Arbitrary<any> | TestPropertyHandler>
): void {
  const passedHandler = other[other.length - 1] as TestPropertyHandler;
  const otherArbitrary = other.slice(0, -1);
  const allArbitrary: ReadonlyArray<any> = [arbitrary1, ...otherArbitrary];

  const innerHandler = (...vars: ReadonlyArray<any>) => {
    let areEqual = false;
    const propertyScheduler = new TestScheduler((actual: any, expected: any) => {
      areEqual = equals(actual)(expected);

      if (!areEqual) {
        // to have a verbose information about marble test error
        return expect(actual).toEqual(expected);
      }

      return areEqual;
    });

    passedHandler(propertyScheduler, ...vars);

    propertyScheduler.flush();
    return areEqual;
  };

  jsc.property(description, ...[...allArbitrary, innerHandler]);
}
