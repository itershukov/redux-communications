import { takeEvery } from '@redux-saga/core/effects';

import { StoreBranch } from './StoreBranch';
import { IFullState, INewable } from '../types';

export type TApiProviderPreRequestHook<Data, Params, Errors> = (
  response: null,
  payload: Params,
  branchState: StoreBranch<Data, Params, Errors>,
  fullState: IFullState<StoreBranch<Data, Params, Errors>>
) => Data;

export type TApiProviderSuccessHook<Data, Params, Errors> = (
  response: Data,
  originalParams: Params,
  branchState: StoreBranch<Data, Params, Errors>,
  fullState: IFullState<StoreBranch<Data, Params, Errors>>
) => any;

export type TApiProviderFailHook<Data, Params, Errors> = (
  response: Errors,
  originalParams: Params,
  branchState: StoreBranch<Data, Params, Errors>,
  fullState: IFullState<StoreBranch<Data, Params, Errors>>
) => any;

export type TApiProviderSuccessMapper<Data, Params, Errors> = (
  response: any,
  payload: Params,
  branchState: StoreBranch<Data, Params, Errors>,
  fullState: IFullState<StoreBranch<Data, Params, Errors>>
) => Data;

export type TApiProviderFailMapper<Data, Params, Errors> = (
  response: any,
  payload: Params,
  branchState: StoreBranch<Data, Params, Errors>,
  fullState: IFullState<StoreBranch<Data, Params, Errors>>
) => Errors;

export type TApiProviderMapParamsHook<Data, Params, Errors> = (
  originalParams: Params,
  branchState: StoreBranch<Data, Params, Errors>,
  fullState: IFullState<StoreBranch<Data, Params, Errors>>
) => any;

export interface IAPIProviderHooks<Data, Params, Errors> {
  onStart?: TApiProviderMapParamsHook<Data, Params | undefined, Errors>; // onStart
  mapParams?: TApiProviderMapParamsHook<Data, Params | undefined, Errors>; // mapParams
  preRequestDataMapper?: TApiProviderPreRequestHook<Data, Params | undefined, Errors>; // preRequestDataMapper
  onSuccess?: TApiProviderSuccessHook<Data, Params | undefined, Errors>; // onSuccess
  onFail?: TApiProviderFailHook<Data, Params | undefined, Errors>; // onFail
  mapSuccess?: TApiProviderSuccessMapper<Data, Params | undefined, Errors>;
  mapFail?: TApiProviderFailMapper<Data, Params | undefined, Errors>;
  clearParams?: boolean;
  throwOnFail?: true;
  hydrateTo?: INewable;
}

export class APIProvider<Data = any, Params = any, Errors = any> {
  public readonly type: string;
  public readonly handler: (payload: Params) => Promise<any>;
  public readonly hooks: IAPIProviderHooks<Data, Params, Errors>;
  public readonly effectHandler = takeEvery;

  constructor(
    type: string,
    handler: (payload: Params) => Promise<any>,
    hooks: IAPIProviderHooks<Data, Params, Errors> = {},
    effectHandler = takeEvery
  ) {
    this.type = type;
    this.handler = handler;
    this.hooks = hooks;
    this.effectHandler = effectHandler;
  }
}
