import { expect } from 'chai';

import {createSimpleAction, createActionWithPayload} from './actions';
import {SimpleAction} from '../interfaces/actions';

describe('createSimpleAction: ', () => {
  it('should be defined', () => {
    expect(createSimpleAction).to.exist;
  });

  it('returns proper action', () => {
    const actionType = 'TEST_TYPE';
    const action: SimpleAction = createSimpleAction(actionType);

    action.should.be.deep.equal({
      type: actionType
    });
  });
});

describe('createSimpleAction: ', () => {
  it('should be defined', () => {
    expect(createActionWithPayload).to.exist;
  });

  it('returns proper action', () => {
    const actionType = 'TEST_TYPE';
    const payload = {
      someData: 100
    };
    const action: SimpleAction = createActionWithPayload(actionType, payload);

    action.should.be.deep.equal({
      type: actionType,
      payload
    });
  });
});
