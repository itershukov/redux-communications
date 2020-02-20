import { fakeResponse } from '../../helpers/transport.helper';

const tasks = {};

export const taskTransport = {
  add: params => {
    const id = Math.floor(Math.random() * 1000);
    tasks[id] = { id, ...params };
    return fakeResponse(tasks[id]);
  },
  update: params => {
    tasks[params.id] = { ...tasks[params.id], ...params.data };
    return fakeResponse(tasks[params.id]);
  },
  get: id => {
    return fakeResponse(tasks[id]);
  },
  delete: id => {
    delete tasks[id];
    return fakeResponse(null);
  },
  getCollection: () => {
    return fakeResponse(Object.values(tasks).sort((a, b) => (a.title > b.title ? 1 : -1)));
  }
};
