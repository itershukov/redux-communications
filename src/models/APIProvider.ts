import { takeEvery } from '@redux-saga/core/effects';

import { StoreBranch } from './StoreBranch';
import { IFullState, INewable } from '../types';

export type TApiProviderHook<Response, Payload> = (
  response: Response,
  payload: Payload,
  branchState: StoreBranch<any, Payload>,
  fullState: IFullState
) => any;

export type TApiProviderMapParamsHook<Payload> = (
  originalParams: Payload,
  branchState: StoreBranch<any, Payload>,
  fullState: IFullState
) => any;

export interface IAPIProviderHooks<Response, Payload> {
  preRequestHook?: TApiProviderHook<null, Payload>;
  responseFormatter?: TApiProviderHook<Response, Payload>;
  postSuccessHook?: TApiProviderHook<Response, Payload>;
  postFailHook?: TApiProviderHook<Response, Payload>;
  preRequestDataMapper?: TApiProviderHook<null, Payload>;
  clearParams?: boolean;
  mapParams?: TApiProviderMapParamsHook<Payload>;
  hydrateTo?: INewable;
}

export class APIProvider<Response extends any = any, Payload extends any = any> {
  public readonly type: string;
  public readonly handler: (payload: Payload) => Promise<Response>;
  public readonly hooks: IAPIProviderHooks<Response, Payload>;
  public readonly effectHandler = takeEvery;

  constructor(
    type: string,
    handler: (payload: Payload) => Promise<Response>,
    hooks: IAPIProviderHooks<Response, Payload> = {},
    effectHandler = takeEvery
  ) {
    this.type = type;
    this.handler = handler;
    this.hooks = hooks;
    this.effectHandler = effectHandler;
  }
}
