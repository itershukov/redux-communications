import { InferableComponentEnhancerWithProps } from 'react-redux';

import { APIProvider } from './models/APIProvider';
import { Branch } from './models/Branch';
import { StoreBranch } from './models/StoreBranch';

export interface INewable<T extends any = any> {
  new (model: Partial<T>): T;
}

export interface IStrategy<InjectedProps> {
  config: IBuilderConfig;
  buildSagas: (customSagas?: []) => Generator[];
  buildInjector: () => InferableComponentEnhancerWithProps<InjectedProps, {}>;
  buildReducers: () => IReducers;
}

type IDispatchAction = (namespace: string, branchName: string, type: string, payload?: any) => void;

export interface IActionsDispatcher {
  dispatchAction: IDispatchAction;
}

export interface IFullState<Branch extends StoreBranch<any, any> = StoreBranch<any, any>> {
  [key: string]: Branch;
}

export interface IBranchType<State extends object = object> {
  name: string;
  apiProviders: APIProvider[];
  initialState: State;
}

export interface IStrategyConfig {
  namespace: string;
  actions?: IActionsDispatcher;
  reducers?: Object;
  sagas?: any[];
}

export interface IBuilderCrudConfig extends IStrategyConfig {
  modelApiProviders?: APIProvider[];
  collectionApiProviders?: APIProvider[];
  modelInitialState?: StoreBranch<any, any>;
  collectionInitialState?: StoreBranch<any, any>;
  transport?: ICRUDTransport;
  branches?: Branch[];
}

export interface ICRUDTransport {
  add: (params: any) => Promise<any>;
  update: (params: any) => Promise<any>;
  get: (params: any) => Promise<any>;
  delete: (params: any) => Promise<any>;
  getCollection: (params: any) => Promise<any>;
}

export interface ISimpleStrategyConfig extends IStrategyConfig {
  modelApiProvider?: APIProvider[];
  modelInitialState?: StoreBranch<any, any>;
  branches?: Branch[];
}

export interface IBuilderConfig extends IStrategyConfig {
  branches: Branch[];
}

export interface IBuilderSyncConfig extends IStrategyConfig {
  branches: IBranchType[];
}

export interface ICommunication<InjectedProps> {
  namespace: string;
  injector: InferableComponentEnhancerWithProps<InjectedProps, {}>;
  branches: IBranchType[];
  reducers: Object;
  sagas: Generator[];
}

export interface IReducers {
  [key: string]: (state: IFullState, action: IAction<unknown>) => IFullState;
}

export interface IAction<Payload, Response = any> {
  type: string;
  payload?: Payload;
  cb?: (err?: Response, result?: Response) => void;
}
