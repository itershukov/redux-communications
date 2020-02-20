import { uiCommunication } from '../communications/simple/ui.communication';
import { taskCommunication } from '../communications/crud/task.communication';
import { userCommunication } from '../communications/base/user.communication';
import { accountCommunication } from '../communications/builders/account.communication';
import { footclothsCommunication } from '../communications/advanced/footcloths.communication';

const reducers = {
  ...uiCommunication.reducers,
  ...footclothsCommunication.reducers,
  ...taskCommunication.reducers,
  ...userCommunication.reducers,
  ...accountCommunication.reducers
};

export default reducers;
