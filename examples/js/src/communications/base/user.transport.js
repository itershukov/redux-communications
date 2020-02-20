import * as data from './user.json';
import { fakeResponse } from '../../helpers/transport.helper';

const users = { default: data.default };
const followers = {};

export const userTransport = {
  follow: user => {
    followers[user.id] = user;
    return fakeResponse();
  },
  unfollow: user => {
    delete followers[user.id];
    return fakeResponse();
  },
  delete: id => {
    delete followers[id];
    users.default = users.default.filter(user => user.id !== id);
    return fakeResponse();
  },
  getCollection: params => {
    let response = users;
    if (params && params.followers) {
      response = { default: Object.values(followers) };
    }
    return fakeResponse({ default: response.default });
  }
};
