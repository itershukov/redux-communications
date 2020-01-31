import { BaseStrategy } from './base';
import { buildCommunication } from '../communicationFactory';
import { expect } from 'chai';
import { APIProvider } from '../models/APIProvider';
import { Branch } from '../models/Branch';

describe('Check communication builder', () => {
  it('should return created communication based on BaseStrategy', () => {
    const namespace = 'users';

    const modelApiProviders = new APIProvider('get', () => [{ id: 1, data: { a: 5 } }, { id: 2, data: { a: 6 } }]);

    const branches = [new Branch('model', modelApiProviders)];

    const config = {
      namespace,
      branches
    };
    const strategy = new BaseStrategy(config);

    const communication = buildCommunication(strategy);

    expect(communication).exist;
    expect(communication.reducers).to.be.an('object');
    expect(communication.sagas).to.be.an('array');

    const reducersNames = Object.keys(communication.reducers);
    expect(reducersNames.length).equal(1);
    expect(reducersNames[0]).equal('users');

    expect(communication.sagas.length).equal(2);
  });
});
