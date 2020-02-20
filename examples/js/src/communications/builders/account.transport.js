import { AccountList } from './account.types';
import { fakeResponse } from '../../helpers/transport.helper';

export const accountTransport = {
  getCollection: params => {
    const accounts = new AccountList(params.limit, params.offset);
    return fakeResponse(accounts);
  },
  approve: () => {
    return fakeResponse();
  },
  decline: () => {
    return fakeResponse();
  }
};
