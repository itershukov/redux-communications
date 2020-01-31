import { APIProvider, IAPIProviderHooks, TApiProviderHook, TApiProviderMapParamsHook } from '../models/APIProvider';
import { INewable } from '../types';

type TOmitedCallOrder<T, P extends keyof T> = THooksAPIProviderBuilder<Omit<T, P>>;

type THooksAPIProviderBuilder<T> = {
  [P in keyof Omit<T, 'setType' | 'setHandler' | 'type' | 'handler' | 'hooks'>]: T[P] extends (...args: any) => T
    ? P extends 'clearBranchParams'
      ? () => TOmitedCallOrder<T, P>
      : P extends 'mapParams'
      ? (mapper: TApiProviderMapParamsHook<any>) => TOmitedCallOrder<T, P>
      : P extends 'hydrateTo'
      ? (ModelCtor: INewable) => TOmitedCallOrder<T, P>
      : (hook: TApiProviderHook<any, any>) => TOmitedCallOrder<T, P>
    : T[P]
};

export type TAPIProviderBuilderInitial = Pick<APIProviderBuilder, 'setType'>;

export class APIProviderBuilder<Response extends any = any, Payload extends any = any> {
  private type!: string;
  private handler!: (payload: Payload) => Promise<Response>;
  private hooks: IAPIProviderHooks<Response, Payload> = {};

  private constructor() {}

  public static create<Response extends any = any, Payload extends any = any>(
    hooks?: IAPIProviderHooks<any, any>
  ): TAPIProviderBuilderInitial {
    const builder = new APIProviderBuilder<Response, Payload>();
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

  public beforeRequest(hook: TApiProviderHook<null, Payload>) {
    this.hooks.preRequestHook = hook;
    return this;
  }

  public formatResponse(hook: TApiProviderHook<Response, Payload>) {
    this.hooks.responseFormatter = hook;
    return this;
  }

  public afterSuccess(hook: TApiProviderHook<Response, Payload>) {
    this.hooks.postSuccessHook = hook;
    return this;
  }

  public afterFail(hook: TApiProviderHook<Response, Payload>) {
    this.hooks.postFailHook = hook;
    return this;
  }

  public setPreRequestDataMapper(mapper: TApiProviderHook<null, Payload>) {
    this.hooks.preRequestDataMapper = mapper;
    return this;
  }

  public clearBranchParams() {
    this.hooks.clearParams = true;
    return this;
  }

  public mapParams(mapper: TApiProviderMapParamsHook<Payload>) {
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
