import { fakeResponse } from '../../helpers/transport.helper';

const footclothss = {};

export const footclothsTransport = {
  add: params => {
    const id = Math.floor(Math.random() * 1000);
    footclothss[id] = { id, ...params };
    return fakeResponse(footclothss[id]);
  },
  update: params => {
    footclothss[params.id] = { ...footclothss[params.id], ...params.data };
    return fakeResponse(footclothss[params.id]);
  },
  get: id => {
    return fakeResponse(footclothss[id]);
  },
  delete: id => {
    delete footclothss[id];
    return fakeResponse(null);
  },
  getCollection: () => {
    return fakeResponse(Object.values(footclothss).sort((a, b) => (a.title > b.title ? 1 : -1)));
  },
  additionalAction: ({ param }) => {
    return (
      new Promise() <
      string >
      ((res, rej) => {
        setTimeout(() => (Math.random() < 0.7 ? res('Success' + param) : rej('Error' + param)), 2000);
      })
    );
  }
};
