import {
  APIProvider,
  IAPIProviderHooks, TApiProviderFailHook, TApiProviderFailMapper,
  TApiProviderMapParamsHook, TApiProviderPreRequestHook, TApiProviderSuccessHook,
  TApiProviderSuccessMapper
} from '../models/APIProvider';
import {APIProviderBuilder, TAPIProviderBuilderInitial} from './APIProviderBuilder';
import {INewable} from '../types';

type TBuilderCallback = (builder: TAPIProviderBuilderInitial) => APIProvider;

type TOmitedCallOrder<T, P extends keyof T> = CallOrder<Omit<T, P>>;

type CallOrder<T> = {
  [P in keyof T]: T[P] extends (...args: any) => T
    ? P extends 'add'
      ? (builderCallback: TBuilderCallback) => CallOrder<T>
      : P extends 'onStart'
        ? (hook: TApiProviderMapParamsHook<any, any, any>) => TOmitedCallOrder<T, P>
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

export class APIProviderGroup {
  private builders: TBuilderCallback[] = [];
  private hooks: IAPIProviderHooks<any, any, any> = {};

  private constructor() {
  }

  public static create(): CallOrder<APIProviderGroup> {
    return new APIProviderGroup();
  }

  public beforeRequest(hook: TApiProviderMapParamsHook<any, any, any>) {
    this.hooks.onStart = hook;
    return this;
  }

  public formatResponse(hook: TApiProviderSuccessMapper<any, any, any>) {
    this.hooks.mapSuccess = hook;
    return this;
  }

  public afterSuccess(hook: TApiProviderSuccessHook<any, any, any>) {
    this.hooks.onSuccess = hook;
    return this;
  }

  public afterFail(hook: TApiProviderFailHook<any, any, any>) {
    this.hooks.onFail = hook;
    return this;
  }

  public setPreRequestDataMapper(mapper: TApiProviderPreRequestHook<any, any, any>) {
    this.hooks.preRequestDataMapper = mapper;
    return this;
  }

  public clearBranchParams() {
    this.hooks.clearParams = true;
    return this;
  }

  public mapParams(mapper: TApiProviderMapParamsHook<any, any, any>) {
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
