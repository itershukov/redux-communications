import { INewFootcloths, IFootclothsModel } from './footcloths.types';
import { fakeResponse } from '../../helpers/transport.helper';

const footclothss: { [key: number]: IFootclothsModel } = {};

export const footclothsTransport = {
  add: (params: INewFootcloths): Promise<IFootclothsModel> => {
    const id = Math.floor(Math.random() * 1000);
    footclothss[id] = { id, ...params };
    return fakeResponse(footclothss[id]);
  },
  update: (params: { id: number; data: INewFootcloths }): Promise<IFootclothsModel> => {
    footclothss[params.id] = { ...footclothss[params.id], ...params.data };
    return fakeResponse(footclothss[params.id]);
  },
  get: (id: number): Promise<IFootclothsModel> => {
    return fakeResponse(footclothss[id]);
  },
  delete: (id: number): Promise<null> => {
    delete footclothss[id];
    return fakeResponse(null);
  },
  getCollection: (): Promise<IFootclothsModel[]> => {
    return fakeResponse(Object.values(footclothss).sort((a, b) => (a.title > b.title ? 1 : -1)));
  },
  additionalAction: ({param}: {param: number}): Promise<string> => {
    return new Promise<string>((res, rej) => {
      setTimeout(() => Math.random() < 0.7 ? res('Success' + param) :  rej('Error'+ param), 2000);
    });
  }
};
