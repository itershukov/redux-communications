import { buildCommunication, SimpleStrategy, StoreBranch } from '@axmit/redux-communications';
import { EMenuItems, IUIConnectedProps, IUIModel } from './ui.types';

const namespace = 'ui';

const strategy = new SimpleStrategy({
  namespace,
  modelInitialState: new StoreBranch<IUIModel>({ activeItem: EMenuItems.Simple })
});

export const uiCommunication = buildCommunication<IUIConnectedProps>(strategy);
