import { StoreBranch } from '@axmit/redux-communications';

export enum EMenuItems {
  Simple,
  CRUD,
  Base,
  Builders,
  Advanced
}

export interface IUIModel {
  activeItem: EMenuItems;
}

export interface IUIConnectedProps {
  uiModel: StoreBranch<IUIModel>;
  setUiModel(params: IUIModel): void;
}
