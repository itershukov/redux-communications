import { buildCommunication, SimpleStrategy, StoreBranch } from '@axmit/redux-communications';
import { EMenuItems } from './ui.types';

const namespace = 'ui';

const strategy = new SimpleStrategy({
  namespace,
  modelInitialState: new StoreBranch({ activeItem: EMenuItems.Simple })
});

export const uiCommunication = buildCommunication(strategy);
