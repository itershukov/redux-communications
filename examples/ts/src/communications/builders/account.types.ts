import { StoreBranch } from '@axmit/redux-communications';
import { IBaseFilterModel } from '@axmit/client-models';

export interface IAccountModel {
  id: number;
  firstName: string;
  lastName: string;
}

export interface IAccountCollection extends Array<IAccountModel> {}

export interface IAccountResponse {
  data: IAccountCollection;
}

export interface IAccountConnectedProps {
  accountList: StoreBranch<AccountList, IBaseFilterModel>;
  getAccountList(params: IBaseFilterModel): void;
}

export class Account implements IAccountModel {
  public id: number;
  public firstName: string;
  public lastName: string;
  constructor({ id, firstName, lastName }: IAccountModel) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export class AccountList {
  public data: Account[];
  constructor(limit: number, offset: number) {
    this.data = [];
    for (let i = offset; i < offset + limit; i++) {
      this.data.push(new Account({ id: i, firstName: `${Math.random()}`, lastName: `${Math.random()}` }));
    }
  }
}
