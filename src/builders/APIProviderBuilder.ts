import {
  APIProvider,
  IAPIProviderHooks, TApiProviderFailHook, TApiProviderFailMapper,
  TApiProviderMapParamsHook,
  TApiProviderPreRequestHook, TApiProviderSuccessHook, TApiProviderSuccessMapper
} from '../models/APIProvider';
import { INewable } from '../types';

type TOmitedCallOrder<T, P extends keyof T> = THooksAPIProviderBuilder<Omit<T, P>>;

type THooksAPIProviderBuilder<T> = {
  [P in keyof Omit<T, 'setType' | 'setHandler' | 'type' | 'handler' | 'hooks'>]: T[P] extends (...args: any) => T
    ? P extends 'clearBranchParams'
      ? () => TOmitedCallOrder<T, P>
      : P extends 'mapParams'
        ? (mapper: TApiProviderMapParamsHook<any, any, any>) => TOmitedCallOrder<T, P>
        : P extends 'preRequestDataMapper'
          ? (mapper: TApiProviderPreRequestHook<any, any, any>) => TOmitedCallOrder<T, P>
          : P extends 'onSuccess'
            ? (mapper: TApiProviderSuccessHook<any, any, any>) => TOmitedCallOrder<T, P>
            : P extends 'onFail'
              ? (mapper: TApiProviderFailHook<any, any, any>) => TOmitedCallOrder<T, P>
              : P extends 'mapSuccess'
                ? (mapper: TApiProviderSuccessMapper<any, any, any>) => TOmitedCallOrder<T, P>
                : P extends 'mapFail'
                  ? (mapper: TApiProviderFailMapper<any, any, any>) => TOmitedCallOrder<T, P>
                  : P extends 'clearBranchParams'
                    ? () => TOmitedCallOrder<T, P>
                    : P extends 'throwOnFail'
                      ? () => TOmitedCallOrder<T, P>
                      : P extends 'hydrateTo'
                        ? (ModelCtor: INewable) => TOmitedCallOrder<T, P>
                        : T[P]
    : T[P]
};

export type TAPIProviderBuilderInitial = Pick<APIProviderBuilder, 'setType'>;

export class APIProviderBuilder<Response extends any = any, Payload extends any = any, Errors extends any = any> {
  private type!: string;
  private handler!: (payload: Payload) => Promise<Response>;
  private hooks: IAPIProviderHooks<Response, Payload, Errors> = {};

  private constructor() {}

  public static create<Response extends any = any, Payload extends any = any, Errors extends any = any>(
    hooks?: IAPIProviderHooks<Response, Payload, Errors>
  ): TAPIProviderBuilderInitial {
    const builder = new APIProviderBuilder<Response, Payload, Errors>();
    if (hooks) {
      builder.hooks = hooks;
    }

    return builder;
  }

  public setType(type: string): Pick<APIProviderBuilder, 'setHandler' | 'setDefaultHandler'> {
    this.type = type;
    return this;
  }

  public setHandler(
    handler: (payload: Payload) => Promise<Response>
  ): THooksAPIProviderBuilder<APIProviderBuilder<Response, Payload>> {
    this.handler = handler;
    return this;
  }

  public setDefaultHandler(): THooksAPIProviderBuilder<APIProviderBuilder<Response, Payload>> {
    this.handler = async (data: any) => data;
    return this;
  }

  public beforeRequest(hook: TApiProviderMapParamsHook<Response, Payload | undefined, Errors>) {
    this.hooks.onStart = hook;
    return this;
  }

  public formatResponse(hook: TApiProviderSuccessMapper<Response, Payload | undefined, Errors>) {
    this.hooks.mapSuccess = hook;
    return this;
  }

  public formatFail(hook: TApiProviderFailMapper<Response, Payload | undefined, Errors>) {
    this.hooks.mapFail = hook;
    return this;
  }

  public afterSuccess(hook: TApiProviderSuccessHook<Response, Payload | undefined, Errors>) {
    this.hooks.onSuccess = hook;
    return this;
  }

  public afterFail(hook: TApiProviderFailHook<Response, Payload | undefined, Errors>) {
    this.hooks.onFail = hook;
    return this;
  }

  public setPreRequestDataMapper(mapper: TApiProviderPreRequestHook<Response, Payload | undefined, Errors>) {
    this.hooks.preRequestDataMapper = mapper;
    return this;
  }

  public clearBranchParams() {
    this.hooks.clearParams = true;
    return this;
  }

  public throwOnFail() {
    this.hooks.throwOnFail = true;
    return this;
  }

  public mapParams(mapper: TApiProviderMapParamsHook<Response, Payload | undefined, Errors>) {
    this.hooks.mapParams = mapper;
    return this;
  }

  public hydrateTo(ModelCtor: INewable) {
    this.hooks.hydrateTo = ModelCtor;
    return this;
  }

  public build(): APIProvider<Response, Payload> {
    const { type, handler, hooks } = this;
    return new APIProvider(type, handler, hooks);
  }
}
