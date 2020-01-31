import { Dispatch } from 'redux';

import { IBranchType } from '../types';
import { APIProvider } from './APIProvider';
import { buildActionCreator, buildReducer, buildSaga } from '../builders';
import { getActionMethodName, getStartType } from '../helpers';
import { EActionsTypes } from '../enums';
import { StoreBranch } from './StoreBranch';

export class Branch<Data extends any = any, Params extends any = any, Errors extends any = any> implements IBranchType {
  public readonly name: string;
  public readonly apiProviders: APIProvider[];
  public readonly initialState: StoreBranch<Data, Params, Errors>;

  constructor(
    name: string,
    apiProviders: APIProvider[] | APIProvider,
    initialState: StoreBranch<Data, Params, Errors> = new StoreBranch<Data, Params, Errors>()
  ) {
    this.name = name;
    this.initialState = initialState;
    if (apiProviders instanceof Array) {
      this.apiProviders = apiProviders;
    } else {
      this.apiProviders = [apiProviders];
    }

    this.apiProviders.push(new APIProvider(EActionsTypes.clear, () => Promise.resolve(null)));
    this.apiProviders.push(new APIProvider(EActionsTypes.set, payload => Promise.resolve(payload)));
    this.apiProviders.push(new APIProvider(EActionsTypes.setErrors, errors => Promise.reject(errors)));
  }

  public buildBranchReducers<Data, Params, Errors>(namespace: string) {
    return this.apiProviders.reduce(
      (accum, provider) => ({
        ...accum,
        ...buildReducer(namespace, this.name, provider.type, this.initialState, provider.hooks)
      }),
      {}
    );
  }

  public buildBranchDispatchers(namespace: string, dispatch: Dispatch) {
    return this.apiProviders.reduce((accum: { [key: string]: (data: Params) => Promise<unknown> }, provider) => {
      const actionMethodLabel = getActionMethodName(namespace, this.name, provider.type);
      const startActionType = getStartType(namespace, this.name, provider.type);

      accum[actionMethodLabel] = data =>
        new Promise((res, rej) => {
          const actionCreator = buildActionCreator(startActionType, (e: unknown, r: unknown) => (e ? rej(e) : res(r)));
          const action = actionCreator(data);
          dispatch(action);
        });

      return accum;
    }, {});
  }

  public buildBranchSagas(namespace: string) {
    return this.apiProviders.map(provider => {
      return buildSaga(namespace, this.name, provider);
    });
  }
}
