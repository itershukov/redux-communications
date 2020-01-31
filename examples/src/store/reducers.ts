import { AnyAction, Reducer } from 'redux';
import { RouterState } from 'react-router-redux';
import { IUIConnectedProps } from '../communications/simple/ui.types';
import { uiCommunication } from '../communications/simple/ui.communication';
import { taskCommunication } from '../communications/crud/task.communication';
import { userCommunication } from '../communications/base/user.communication';
import { accountCommunication } from '../communications/builders/account.communication';
import { footclothsCommunication } from '../communications/advanced/footcloths.communication';
import { ITaskConnectedProps } from '../communications/crud/task.types';
import { IUserConnectedProps } from '../communications/base/user.types';
import { IFootclothsConnectedProps } from '../communications/advanced/footcloths.types';
import { IAccountConnectedProps } from '../communications/builders/account.types';
type RoutingReducer = Reducer<RouterState, AnyAction>;

export interface IApplicationState {
  routing?: RoutingReducer | null;
  ui: IUIConnectedProps;
  task: ITaskConnectedProps;
  user: IUserConnectedProps;
  account: IAccountConnectedProps;
  footcloths: IFootclothsConnectedProps;
}

const reducers = {
  ...uiCommunication.reducers,
  ...footclothsCommunication.reducers,
  ...taskCommunication.reducers,
  ...userCommunication.reducers,
  ...accountCommunication.reducers
};

export default reducers;
