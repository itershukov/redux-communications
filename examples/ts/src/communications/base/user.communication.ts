import { EUserActionsTypes, IUserCollection, IUserConnectedProps } from './user.types';
import {
  buildCommunication,
  BaseStrategy,
  APIProvider,
  EActionsTypes,
  Branch,
  getStartType,
  buildCollectionPreRequestDataMapper
} from '@axmit/redux-communications';
import { userTransport } from './user.transport';
import { userResponseFormatter } from './user.helpers';
import { put } from 'redux-saga/effects';

const namespace = 'user';

const userCollectionConfig = {
  mapSuccess: userResponseFormatter, // Reformat response from BE
  preRequestDataMapper: buildCollectionPreRequestDataMapper<IUserCollection, undefined>() // Prevent clear branch when request started
};

const userHooksConfig = {
  onSuccess: reloadCollections // After success add item we need reload users and followers collection
};

const UserCollectionAPIProvider = new APIProvider(EActionsTypes.get, () => userTransport.getCollection(), userCollectionConfig);
const UserFollowersAPIProvider = new APIProvider(
  EActionsTypes.get,
  () => userTransport.getCollection({ followers: true }),
  userCollectionConfig
);

const UserApiProviders = [
  new APIProvider(EUserActionsTypes.follow, userTransport.follow, userHooksConfig),
  new APIProvider(EUserActionsTypes.unFollow, userTransport.unfollow, userHooksConfig),
  new APIProvider(EActionsTypes.delete, userTransport.delete, userHooksConfig)
];

const branches = [
  new Branch('followers', UserFollowersAPIProvider),
  new Branch('collection', UserCollectionAPIProvider),
  new Branch('model', UserApiProviders)
];

const strategy = new BaseStrategy({
  namespace,
  branches
});

export const userCommunication = buildCommunication<IUserConnectedProps>(strategy);

export function* reloadCollections() {
  yield put({ type: getStartType(namespace, 'collection', EActionsTypes.get) });
  yield put({ type: getStartType(namespace, 'followers', EActionsTypes.get) });
}
