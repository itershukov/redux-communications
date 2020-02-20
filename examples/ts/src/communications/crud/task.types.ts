import { StoreBranch } from '@axmit/redux-communications';

export interface INewTask {
  title: string;
}

export interface ITaskModel {
  id: number;
  title: string;
}

export interface ITaskConnectedProps {
  taskModel: StoreBranch<ITaskModel>;
  taskCollection: StoreBranch<ITaskModel[]>;
  addTaskModel(params: INewTask): void;
  getTaskModel(id: number): void;
  updateTaskModel(params: { id: number; data: INewTask }): void;
  deleteTaskModel(params: number): void;
  getTaskCollection(): void;
}
