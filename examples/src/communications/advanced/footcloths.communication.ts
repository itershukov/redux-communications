import {
  APIProvider,
  Branch,
  buildCommunication,
  CRUDStrategy
} from '@axmit/redux-communications';
import {footclothsTransport} from './footcloths.transport';
import {IFootclothsConnectedProps} from './footcloths.types';

const UserFollowersAPIProvider = new APIProvider(
  'activate',
  footclothsTransport.additionalAction,
  {throwOnFail: true}
);

const branches = [
  new Branch('', UserFollowersAPIProvider)
];

const namespace = 'footcloths';

const strategy = new CRUDStrategy({
  namespace,
  transport: footclothsTransport,
  branches
});

export const footclothsCommunication = buildCommunication<IFootclothsConnectedProps>(strategy);

