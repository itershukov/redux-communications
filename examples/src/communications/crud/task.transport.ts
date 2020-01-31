import { ICRUDTransport } from '@axmit/redux-communications';
import { INewTask, ITaskModel } from './task.types';
import { fakeResponse } from '../../helpers/transport.helper';

const tasks: { [key: number]: ITaskModel } = {};

export const taskTransport: ICRUDTransport = {
  add: (params: INewTask): Promise<ITaskModel> => {
    const id = Math.floor(Math.random() * 1000);
    tasks[id] = { id, ...params };
    return fakeResponse(tasks[id]);
  },
  update: (params: { id: number; data: INewTask }): Promise<ITaskModel> => {
    tasks[params.id] = { ...tasks[params.id], ...params.data };
    return fakeResponse(tasks[params.id]);
  },
  get: (id: number): Promise<ITaskModel> => {
    return fakeResponse(tasks[id]);
  },
  delete: (id: number): Promise<null> => {
    delete tasks[id];
    return fakeResponse(null);
  },
  getCollection: (): Promise<ITaskModel[]> => {
    return fakeResponse(Object.values(tasks).sort((a, b) => (a.title > b.title ? 1 : -1)));
  }
};
