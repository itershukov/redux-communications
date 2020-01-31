import { IBuilderConfig, ISimpleStrategyConfig } from '../types';
import { BaseStrategy } from './base';
import { Branch } from '../models/Branch';

export class SimpleStrategy<InjectedProps, Data, Params, Errors> extends BaseStrategy<InjectedProps> {
  constructor(config: ISimpleStrategyConfig) {
    const extendedConfig: IBuilderConfig = {
      ...config,
      branches: [
        new Branch('model', config.modelApiProvider || [], config.modelInitialState),
        ...(config.branches || [])
      ]
    };
    super(extendedConfig);
  }
}
