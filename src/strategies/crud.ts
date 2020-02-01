import { IBuilderConfig, IBuilderCrudConfig } from '../types';
import { BaseStrategy } from './base';
import { Branch } from '../models/Branch';
import { APIProvider, IAPIProviderHooks } from '../models/APIProvider';
import { EActionsTypes } from '../enums';
import { put, select } from 'redux-saga/effects';
import { getStartType } from '../helpers';
import { buildCollectionPreRequestDataMapper } from '../formatters';
import { IBaseCollection, IBaseFilterModel } from '@axmit/client-models';

export class CRUDStrategy<
  InjectedProps,
  IModel = any,
  ICollection extends IBaseCollection<IModel, any> = IBaseCollection<IModel, any>,
  ICollectionFilters extends IBaseFilterModel = IBaseFilterModel
> extends BaseStrategy<InjectedProps> {
  constructor(config: IBuilderCrudConfig) {
    const modelAPIProviders: APIProvider[] = [];

    const collectionAPIProviders: APIProvider[] = [];

    if (config.transport) {
      function* onSuccess() {
        const params = yield select(state => state[config.namespace] && state[config.namespace].collection.params);

        yield put({ type: getStartType(config.namespace, 'collection', EActionsTypes.get), payload: params });
      }

      const modelHooks = { onSuccess };

      modelAPIProviders.push(
        new APIProvider(EActionsTypes.add, config.transport.add, modelHooks),
        new APIProvider(EActionsTypes.get, config.transport.get, modelHooks),
        new APIProvider(EActionsTypes.update, config.transport.update, modelHooks),
        new APIProvider(EActionsTypes.delete, config.transport.delete, modelHooks)
      );

      const collectionHooks: IAPIProviderHooks<ICollection | null, ICollectionFilters, any> = {
        preRequestDataMapper: buildCollectionPreRequestDataMapper<ICollection, ICollectionFilters>()
      };

      collectionAPIProviders.push(new APIProvider(EActionsTypes.get, config.transport.getCollection, collectionHooks));
    }

    const extendedConfig: IBuilderConfig = {
      ...config,
      branches: [
        new Branch('model', config.modelApiProviders || modelAPIProviders, config.modelInitialState),
        new Branch('collection', config.collectionApiProviders || collectionAPIProviders, config.collectionInitialState),
        ...(config.branches || [])
      ]
    };
    super(extendedConfig);
  }
}
