import { AccountList } from './account.types';
import { IBaseFilterModel } from '@axmit/client-models';
import { fakeResponse } from '../../helpers/transport.helper';

export const accountTransport = {
  getCollection: (params: IBaseFilterModel): Promise<AccountList> => {
    const accounts = new AccountList(params.limit, params.offset);
    return fakeResponse(accounts);
  },
  approve: (): Promise<void> => {
    return fakeResponse();
  },
  decline: (): Promise<void> => {
    return fakeResponse();
  }
};
