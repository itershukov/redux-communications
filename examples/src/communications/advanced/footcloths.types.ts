import { StoreBranch } from '@axmit/redux-communications';

export interface INewFootcloths {
  title: string;
}

export interface IFootclothsModel {
  id: number;
  title: string;
}

export interface IFootclothsConnectedProps {
  footclothsModel: StoreBranch<IFootclothsModel>;
  footclothsCollection: StoreBranch<IFootclothsModel[]>;
  addFootclothsModel(params: INewFootcloths): void;
  getFootclothsModel(id: number): void;
  updateFootclothsModel(params: { id: number; data: INewFootcloths }): void;
  deleteFootclothsModel(params: number): void;
  getFootclothsCollection(): void;
  activateFootcloths({param: number}): Promise<string>;
}
