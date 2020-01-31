import { ICommunication, IStrategy } from './types';

export function buildCommunication<InjectedProps>(strategy: IStrategy<InjectedProps>): ICommunication<InjectedProps> {
  const reducers = strategy.buildReducers();
  const sagas = strategy.buildSagas();
  const injector = strategy.buildInjector();

  return {
    namespace: strategy.config.namespace,
    branches: strategy.config.branches,
    reducers,
    sagas,
    injector
  };
}
