import { should as _should } from 'chai';

import {createSimpleAction} from './actions';
import {SimpleAction} from '../interfaces/actions';

const should = _should();

describe('createSimpleAction: ', () => {
  it('should be defined', () => {
    should.exist(createSimpleAction);
  });

  it('returns proper action', () => {
    const actionType = 'TEST_TYPE';
    const action: SimpleAction = createSimpleAction('TEST_TYPE');

    action.should.be.deep.equal({
      type: actionType
    });
  });
});
