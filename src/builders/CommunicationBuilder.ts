import { Branch } from '../models/Branch';
import { BaseStrategy } from '../strategies/base';
import { buildCommunication } from '../communicationFactory';
import { APIProvider } from '../models/APIProvider';

export class CommunicationBuilder {
  private branches: Branch[] = [];
  private namespace!: string;
  private sagas: Generator[] = [];

  public setNamespace(namespace: string) {
    this.namespace = namespace;
    return this;
  }

  public addBranch(name: string, apiProviders: APIProvider | APIProvider[], initialState?: any) {
    const branch = new Branch(name, apiProviders, initialState);
    this.branches.push(branch);

    return this;
  }

  public addSaga(saga: Generator) {
    this.sagas.push(saga);
    return this;
  }

  public build<T>() {
    const { namespace, branches, sagas } = this;

    const strategy = new BaseStrategy({
      namespace,
      branches
    });

    const communication = buildCommunication<T>(strategy);
    communication.sagas = communication.sagas.concat(sagas);

    return communication;
  }
}
