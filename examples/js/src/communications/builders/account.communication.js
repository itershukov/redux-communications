import {
  APIProviderBuilder,
  APIProviderGroup,
  CommunicationBuilder,
  StoreBranch,
  EActionsTypes,
  buildCollectionPreRequestDataMapper,
  buildCollectionResponseFormatter
} from '@axmit/redux-communications';
import { accountTransport } from './account.transport';
import { message } from 'antd';
import { AccountList } from './account.types';

function toast() {
  message.success('Data loaded!');
}

const externalItemAPIProviders = APIProviderGroup.create()
  .add(builder =>
    builder
      .setType('approve')
      .setHandler(accountTransport.approve)
      .build()
  )
  .add(builder =>
    builder
      .setType('decline')
      .setHandler(accountTransport.decline)
      .build()
  )
  .build();

export const accountCommunication = new CommunicationBuilder()
  .setNamespace('account')
  .addBranch(
    'list',
    [
      ...externalItemAPIProviders,
      APIProviderBuilder.create()
        .setType(EActionsTypes.get)
        .setHandler(accountTransport.getCollection)
        .afterSuccess(toast)
        .setPreRequestDataMapper(buildCollectionPreRequestDataMapper())
        .formatResponse(buildCollectionResponseFormatter())
        .build()
    ],
    new StoreBranch(new AccountList(10, 0), { limit: 10, offset: 0 })
  )
  .build();
