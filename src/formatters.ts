import { IBaseCollection, IBaseFilterModel } from '@axmit/client-models';

import { StoreBranch } from './models/StoreBranch';

export function buildCollectionResponseFormatter<
  TResponse extends IBaseCollection<any, any>,
  TPayload extends IBaseFilterModel
>() {
  return (response: TResponse, payload: TPayload, branchState: StoreBranch<TResponse, TPayload>) => {
    if (typeof payload.offset !== 'undefined' && payload.offset === 0) {
      return response;
    }
    const oldData = (branchState.data && branchState.data.data) || [];
    return { data: [...oldData, ...response.data], meta: response.meta };
  };
}

export function buildCollectionPreRequestDataMapper<ICollection, TPayload>() {
  return (response: null, payload: TPayload | undefined, branchState: StoreBranch<ICollection | null, TPayload | undefined>) => branchState.data;
}
