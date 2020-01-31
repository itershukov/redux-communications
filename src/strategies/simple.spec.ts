import { SimpleStrategy } from './simple';
import { buildCommunication } from '../communicationFactory';
import { expect } from 'chai';
import { APIProvider } from '../models/APIProvider';

describe('Check communication builder', () => {
  it('should return created communication SimpleStrategy', () => {
    const namespace = 'users';

    const apiProviders = [new APIProvider('get', () => Promise.resolve([{ id: 1, data: { a: 5 } }, { id: 2, data: { a: 6 } }]))];

    const config = {
      namespace,
      modelApiProvider: apiProviders
    };
    const strategy = new SimpleStrategy(config);

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
