import { APIProvider, IAPIProviderHooks, TApiProviderHook, TApiProviderMapParamsHook } from '../models/APIProvider';
import { APIProviderBuilder, TAPIProviderBuilderInitial } from './APIProviderBuilder';
import { INewable } from '../types';

type TBuilderCallback = (builder: TAPIProviderBuilderInitial) => APIProvider;

type TOmitedCallOrder<T, P extends keyof T> = CallOrder<Omit<T, P>>;

type CallOrder<T> = {
  [P in keyof T]: T[P] extends (...args: any) => T
    ? P extends 'add'
      ? (builderCallback: TBuilderCallback) => CallOrder<T>
      : P extends 'clearBranchParams'
      ? () => TOmitedCallOrder<T, P>
      : P extends 'mapParams'
      ? (mapper: TApiProviderMapParamsHook<any>) => TOmitedCallOrder<T, P>
      : P extends 'hydrateTo'
      ? (ModelCtor: INewable) => TOmitedCallOrder<T, P>
      : (hook: TApiProviderHook<any, any>) => TOmitedCallOrder<T, P>
    : T[P]
};

export class APIProviderGroup {
  private builders: TBuilderCallback[] = [];
  private hooks: IAPIProviderHooks<any, any> = {};

  private constructor() {}

  public static create(): CallOrder<APIProviderGroup> {
    return new APIProviderGroup();
  }

  public beforeRequest(hook: TApiProviderHook<any, any>) {
    this.hooks.preRequestHook = hook;
    return this;
  }

  public formatResponse(hook: TApiProviderHook<any, any>) {
    this.hooks.responseFormatter = hook;
    return this;
  }

  public afterSuccess(hook: TApiProviderHook<any, any>) {
    this.hooks.postSuccessHook = hook;
    return this;
  }

  public afterFail(hook: TApiProviderHook<any, any>) {
    this.hooks.postFailHook = hook;
    return this;
  }

  public setPreRequestDataMapper(mapper: TApiProviderHook<null, any>) {
    this.hooks.preRequestDataMapper = mapper;
    return this;
  }

  public clearBranchParams() {
    this.hooks.clearParams = true;
    return this;
  }

  public mapParams(mapper: TApiProviderMapParamsHook<any>) {
    this.hooks.mapParams = mapper;
    return this;
  }

  public hydrateTo(ModelCtor: INewable) {
    this.hooks.hydrateTo = ModelCtor;
    return this;
  }

  public add(builderCallback: TBuilderCallback) {
    this.builders.push(builderCallback);
    return this;
  }

  public build(): APIProvider[] {
    return this.builders.map(builderCallback => builderCallback(APIProviderBuilder.create(this.hooks)));
  }
}
