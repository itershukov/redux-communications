import { all } from 'redux-saga/effects';
import { uiCommunication } from '../communications/simple/ui.communication';
import { taskCommunication } from '../communications/crud/task.communication';
import { userCommunication } from '../communications/base/user.communication';
import { accountCommunication } from '../communications/builders/account.communication';
import { footclothsCommunication } from '../communications/advanced/footcloths.communication';

export default function* rootSaga(): any {
  yield all([
    ...uiCommunication.sagas,
    ...userCommunication.sagas,
    ...accountCommunication.sagas,
    ...footclothsCommunication.sagas,
    ...taskCommunication.sagas,
  ]);
};
