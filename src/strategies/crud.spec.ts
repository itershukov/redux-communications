import { CRUDStrategy } from './crud';
import { buildCommunication } from '../communicationFactory';
import { expect } from 'chai';
import { APIProvider } from '../models/APIProvider';

describe('Check communication builder', () => {
  it('should return created communication based on CRUDStrategy', () => {
    const namespace = 'users';

    const collectionApiProviders = [new APIProvider('get', () => [{ id: 1, data: { a: 5 } }, { id: 2, data: { a: 6 } }])];
    const modelApiProviders = [new APIProvider('get', () => ({ id: 1, data: { a: 5 } }))];

    const config = {
      namespace,
      collectionApiProviders,
      modelApiProviders
    };
    const strategy = new CRUDStrategy(config);

    const communication = buildCommunication(strategy);

    expect(communication).exist;
    expect(communication.reducers).to.be.an('object');
    expect(communication.sagas).to.be.an('array');

    const reducersNames = Object.keys(communication.reducers);
    expect(reducersNames.length).equal(1);
    expect(reducersNames[0]).equal('users');

    expect(communication.sagas.length).equal(4);
  });
});
