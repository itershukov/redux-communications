import { IUserModel, IUserResponse } from './user.types';
import * as data from './user.json';
import { fakeResponse } from '../../helpers/transport.helper';

const users = ({ default: (data as any).default } as unknown) as IUserResponse;
const followers: { [key: number]: IUserModel } = {};

export const userTransport = {
  follow: (user: IUserModel): Promise<void> => {
    followers[user.id] = user;
    return fakeResponse();
  },
  unfollow: (user: IUserModel): Promise<void> => {
    delete followers[user.id];
    return fakeResponse();
  },
  delete: (id: number): Promise<void> => {
    delete followers[id];
    users.default = users.default.filter(user => user.id !== id);
    return fakeResponse();
  },
  getCollection: (params?: { followers?: true }): Promise<IUserResponse> => {
    let response = users;
    if (params && params.followers) {
      response = { default: Object.values(followers) };
    }
    return fakeResponse({ default: response.default });
  }
};
