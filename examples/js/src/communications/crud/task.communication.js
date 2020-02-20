import { taskTransport } from './task.transport';
import { CRUDStrategy, buildCommunication } from '@axmit/redux-communications';

const namespace = 'task';

const strategy = new CRUDStrategy({
  namespace,
  transport: taskTransport
});

export const taskCommunication = buildCommunication(strategy);
