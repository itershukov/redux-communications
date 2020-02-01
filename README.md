# Redux communications

This package provides a toolset to simplify working with redux and saga libs.

## Installation

`npm i @axmit/redux-communications` or `yarn add @axmit/redux-communications`

## Quick start

To create a new communication you should do the following:

```typescript
import { APIProvider, Branch, BaseStrategy, buildCommunication, StoreBranch, actionsTypes } from '@axmit/redux-communications';

export interface ILineModel {
  id: number;
  name: string;
}

export interface ILineCollectionParams {
  limit:number,
  offset:number
}

const namespace = 'line';
export interface ILinesConnectedProps {
 lineCollection: StoreBranch<ILineModel[]>;
 getLineCollection(params: ILineCollectionParams): Promise<ILineModel[]>; // Actions returns a promise
 clearLineCollection(): void;
}

const apiProvider = new APIProvider(actionsTypes.get, Promise<ILineModel[]> => axios.get(`/lines`));
const branches = [new Branch('collection', apiProvider, new StoreBranch([])]

const strategy = new BaseStrategy({
 namespace, branches})

const communicationLine = buildCommunication<ILinesConnectedProps>(strategy);
```

After that you will have a communication that contains the base set of reducers, actions. You can easily setup it as usual.

```
//Sagas setup
export default function* rootSaga(): any {
 yield all([
    ...communicationLine.sagas
 ]);
}

//Reducers setup
const reducers = {
    ...communicationLine.reducers
};
```

Communication also contains `injector` for adding generated dispatchers and store branches to components

```typescript
import React from 'react';
import { ILinesConnectedProps } from './linesCommunication';

class TestComponent extends React.Component<ILinesConnectedProps> {
  //Component logic goes here
}

communicationLine.injector(TestComponent);
```

## Troubleshooting

1. Make sure the following dependencies are synced between lib and your project:

- "react"
- "react-redux"
- "redux"
- "redux-saga"

## Terms

The main entity of this package is StoreBranch. StoreBranch is required to store a part of application state.

Namespace - group of StoreBranches.

ApiProvider - tool to link some external data source to a StoreBranch.

Strategy - defines behavior for creating communication.

Communication - it's a generated combination sagas, reducers and actions that can be injected in a component.

Communication factory - function to build communication based on selected strategy

## Detailed explanation

The idea of this package is to provide a simple way (toolset) of generating event publishers and subscribers.

### **!!! _IMPORTANT_ !!!**

> If you want to understand this module completely, you should be familiar with publisher-subscriber pattern (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern). > Because in fact this pattern underlies the Redux/Saga communication.

In fact we have:

1. event publisher
   - actions - common example for generating events
2. event subscriber reducer
   - reducer - common example for handling events and updating the store
   - saga - handlers that can be used for side effects and generating new event

Actually each async action consists of 3 actions:

1. Start action - triggered to start execution of async call
2. Success action - called if action finished with success
3. Fail action - called if action finished with failure

We can use reducers to update the store depending on action type. Sagas are used to generate some actions depending on results of other actions.

For example, we can handle _USER_MODEL_GET_SUCCESS_ action and after that generate action _TASK_COLLECTION_GET_START_ to start getting collection of tasks for current user.

## Store structure:

### StoreBranch

The store consists of namespaces that are divided into branches. Each branch contains 4 fields:

1. Data - data for this branch
2. Loading - status of data loading of this branch
3. Errors - errors for branch if there are any
4. Params - params that are provided in the start action  
   For more details see implementation in ./src/buildReducer.ts

#### Example:

Namespace - user  
Branches - model, collection

```typescript
store = {
  user: {
    model: {
      data: {
        userInfo: {
          id: 1,
          firstName: 'Ivan',
          lastName: 'Tershukov'
        },
        userMeta: {
          lastLoginAt: '01.01.19 12:00'
        }
      },
      params: 1, // id of current model
      loading: false,
      errors: null
    },
    collection: {
      data: {
        data: [
          {
            id: 1,
            firstName: 'Ivan',
            lastName: 'Tershukov'
          },
          {
            id: 2,
            firstName: 'Bender',
            lastName: 'Rodríguez'
          },
          {
            id: 3,
            firstName: 'Philip',
            lastName: 'Fry'
          }
        ],
        meta: {
          limit: 100,
          offset: 0,
          q: ''
        }
      },
      params: {
        order: 'asc',
        limit: 10,
        offset: 50
      },
      loading: false,
      errors: null
    }
  }
};
```

# Inner structure

## Strategies:

The strategy determines which part of communication logic will be generated.

All strategy receives config as constructor param. Every strategy has unique params set but there is common config params for all of them:

- namespace: string (required) - name of store namespace to be generated
- actions: Array (optional) - array of custom actions
- reducers: Array (optional) - array of custom reducers
- sagas: Array (optional) - array of custom sagas

### BaseStrategy

This strategy requires direct approach in communication generation. You must specify at least `namespace` and `branches` to get communication.

Available `BaseStrategy` methods:

#### constructor(config)

Inits strategy with passed configuration. Available fields

- branches: Branch[](required) - array of `Branches` see below for more information

#### .buildReducers()

Method to build reducers based on strategy config

#### .buildInjector()

Method to build injector based on strategy config

#### .buildSagas()

Method to build sagas based on strategy config

### CRUDStrategy

This strategy predefines 2 namespace branches in `Redux`:

1. Model
2. Collection

It extends `BaseStrategy` so methods are similar

#### constructor(config)

Inits strategy with passed configuration. Available fields

- modelApiProviders: APIProvider[](required) - array of APIProviders connected to model store branch
- collectionApiProviders: APIProvider[](required) - array of APIProviders connected to collection store branch
- modelInitialState: StoreBranch (optional) - initial state for model branch
- collectionInitialState: StoreBranch (optional) - initial state for collection branch
- transport: ICRUDTransport (optional) - transport that can be used to automatically generation of API providers 
- branches: Branch[] (optional) - array ob Branches that can be user to extend base behaviour ot CRUD strategy

### SimpleStrategy

This strategy can be used for keeping UI data.

This strategy predefines only one namespace branch `model` in `Redux`:  
It extends `BaseStrategy` so methods are similar.

#### constructor(config)

Inits strategy with passed configuration. Available fields

- apiProvider: APIProvider[](required) - array of APIProviders connected to model store branch
- initialState: StoreBranch (optional) - initial state for model branch
- branches: Branch[] (optional) - array of Branches that can be user to extend base behaviour ot CRUD strategy

## Class Helpers

There is an amount of classes to help you build your communication

### APIProvider

This class contains provider for your API logic (request and so on)  
**NOTE!** For each API provider you defined a saga will be generated

**!!! _IMPORTANT_ !!!**

By default before each async call of APIProvider a store will be cleared. To prevent this behavior use:
`preRequestDataMapper`

#### constructor(type, handler, hooks)

- type: string - string literal indicating type of performing action (can be any string you like)
- handler: Function - function containing provider logic (ex. API call)
- hooks (optional) - object containing different hooks for APIProvider each hook is function with following signature (response, payload, branchState, fullState) => any:

  - response - handler call result
  - payload - action payload
  - branchState - current branch state
  - fullState- full application state

  Available hooks:

  - mapSuccess - occur just after after handler call
  - onSuccesss - occur after success action is dispatched
  - onFails - occur after fail action is dispatched
  - onStart - occur before API call
  - clearParams (`boolean` flag) - if true clear StoreBranch params after success
  - mapParams - allow you to map params to be passed into API call

#### Example

```typescript
new APIProvider('get', () => axios.get('/test'), {
  mapSuccess: (response, payload, branchState, fullState) => response.map(item => response.test)
});
```

This `APIProvider` will generate a saga which sends GET /test and apply `mapSuccess` to response

### Branch

This class is responsible for namespace branches in store

Available `Branch` methods

#### constructor(name, apiProviders, initialState)

- name: string - branch name
- apiProviders: APIProvider[] | APIProvider - array of APIProviders connected to branch 
- initialState: StoreBranch - initial state of branch

#### .buildBranchReducers(namespace: string)

Builds reducers for store branch

#### .buildBranchDispatchers(namespace: string)

Builds dispatchers for store branch

#### .buildBranchSagas(namespace: string)

Builds sagas for store branch

### StoreBranch

Helper class for defining store branches, every store branch is instance of `StoreBranch`

Contains the following fields:

- data - main branch data
- params - params for dispatchers
- errors - branch errors
- loading - progress of current async operation

#### constructor(data, params, errors, loading)

## Communication factory

This factory contains functions for communications build:

### buildCommunication

Build communication based on strategy provided. Return object containing:

- namespace: string - namespace
- branches: Branches[] - store branches
- reducers - builded reducers (must be includes into application reducers)
- sagas - builded sagas (must be included into application sagas)
- injector - react HOC for injecting props into components (connect())

**NOTE!** To make `injector` work correctly you must define interface describing injected props and pass it into `buildCommunication`

### Example

```typescript
import { APIProvider, Branch, BaseStrategy, buildCommunication, StoreBranch } from '@axmit/redux-communications';

export interface ITestConnectedProps {
  testNames: StoreBranch<string[], string>;
  getTestNames(searchStr?: string): void;
  clearTestNames(): void;
}

const apiProvider = new APIProvider('get', () => axios.get('/test/names'));
const branches = [new Branch('names', apiProvider, new StoreBranch([]))];

const strategy = new BaseStrategy({
  namespace: 'test',
  branches
});

const testCommunication = buildCommunication<ITestConnectedProps>(strategy);
```

## Async dispatching

If you need to check that action has finished in a component you can check that loading state was changed OR use async dispatcher.

### Example

```typescript
import { APIProvider, Branch, BaseStrategy, buildCommunication, StoreBranch } from '@axmit/redux-communications';

export interface ITestConnectedProps {
  testNames: StoreBranch<string[], string>;
  getTestNames(searchStr?: string): Promise<string[]>;
  clearTestNames(): void;
}

const apiProvider = new APIProvider('get', () => axios.get('/test/names'));
const branches = [new Branch('names', apiProvider, new StoreBranch([]))];

const strategy = new BaseStrategy({
  namespace: 'test',
  branches
});

const testCommunication = buildCommunication<ITestConnectedProps>(strategy);
```

and then in a component:

```
...
async componentDidMount(){
  try{
    const result = await this.props.getTestNames();
  }  catch(e){
    // Do something
  }

}
...

```

In this example `ITestConnectedProps` passed as generic param into `buildCommunication` for right types in injector;

## !!!IMPORTANT Rules of IConnectedProps interfaces

Connected props interface contains 2 parts:

- state branches - generates amount you pass into strategy based on `Branch` , for each branch injector will add property by following format `[namespace][BranchName]` .
  - **Example** if namespace is `lines` and there is 2 branches: `[new Branch('model'), new Branch('collection')]` then there will be 2 properties injected by generated injector: `linesModel` and `linesCollection`
- dispatchers - generates based on `APIProviders` amount plus `clear` dispatcher for each branch is generated automatically. For each `APIProvider` will be generated dispatcher by following format `[APIProviderType][Namespace][BranchName]`.

  - **Example** if namespace is `lines`, branch is `new Branch('names', apiProviders)` and `apiProviders` are  
     `typescript const apiProviders = [ new APIProvider('get', handler), new APIProvider('update', handler2) ]`  
    Dispatchers to be generated will be  
     `getLinesNames clearLinesNames updateLinesNames`

## Toolset

This package also contains a toolset that simplifies your life.  
For example you can easy generate types for actions:

```
getStartType('users', 'model', 'get') => USERS_MODEL_GET_TRY
getSuccessType('users', 'model', 'get') => USERS_MODEL_GET_SUCCESS
getFailType('users', 'model', 'get') => USERS_MODEL_GET_FAIL
getUpdateParamsType('users', 'model') => USERS_MODEL_UPDATE_PARAMS
```

Also you can easily generate names for API provider methods

```
getAPIMethodName('users', 'model', 'GET') => getUsersModel
```

More examples see in: ./src/helpers.spec.ts

## Types of actions

actionsTypes - it's enum with base set of default actions.  
At at the moment it supports _init_, _clear_, _add_, _get_, _update_ and _delete_ types.

## Sagas combinations

If you want to add sagas you can just add them directly in communication sagas array or in the root saga.

```
function* getEmptyCollection(action: any) {
 // Here you can use put to generate action or call to call any async funtions ...}
function* getEmptyCollectionSaga() {
 const successActionType = getSuccessType(namespace, 'collection', actionsTypes.get);

 yield takeEvery(successActionType, getEmptyCollection);

}
```

and then

```
communicationLine.sagas.push(getEmptyCollectionSaga());
```

or

```
export default function* rootSaga(): any {
 yield all([ getEmptyCollectionSaga(), ... ]);
}
```

## Full example

```typescript
import { APIProvider, Branch, BaseStrategy, buildCommunication, StoreBranch, actionsTypes } from '@axmit/redux-communications';

const namespace = 'line';

export interface ILineModel {
  id: number;
  name: string;
}

export interface ILineCollectionParams {
  limit:number,
  offset:number
}

export interface ILinesConnectedProps {
  lineCollection: StoreBranch<ILineModel[]>;
  lineModel: StoreBranch<ILineModel>;
  getLineCollection(params: ILineCollectionParams): void;
  clearLineCollection(): void;
  getLineModel(id: number): void;
  updateLineModel(id: number, data: ILineModel): void;
  clearLineModel(): void;
}

const collectionApiProvider = new APIProvider(actionsTypes.get, (params: ILineCollectionParams): Promise<ILineModel[]> => axios.get(`/lines`));
const modelApiProvider = [
  new APIProvider(actionsTypes.get, (id: number): Promise<ILineModel> => axios.get(`/lines/${id}`), {
    mapSuccess: (response, payload, branchState, fullState) => response.map(model => model),
    onSuccess: (response, payload, branchState, fullState) => console.log('post success'),
    onFail: (response, payload, branchState, fullState) => console.log('post fail')
  }),
  new APIProvider(actionsTypes.update, (id: number, data: ILineModel): Promise<ILineModel> => axios.put(`/lines/${id}`, data))
];

const branches = [new Branch('collection', collectionApiProvider, new StoreBranch([])), new Branch('model', modelApiProvider)];

const strategy = new BaseStrategy({
  namespace,
  branches
});

export const communicationLine = buildCommunication<ILinesConnectedProps>(strategy);
```

## Builders full example

```
import { put } from 'redux-saga/effects';
import { StoreBranch } from '../models/StoreBranch';
import { getStartType } from '../helpers';
import { actionsTypes } from '../enums';
import { CommunicationBuilder } from './CommunicationBuilder';
import { APIProviderBuilder } from './APIProviderBuilder';
import { APIProviderGroup } from './APIProviderGroup';
import { APIProvider } from '../models/APIProvider';

export interface IAccountConnectedProps {
  accountExternalCollection: StoreBranch<AccountWidgetCollectionModel>;
  accountItem: StoreBranch<AccountModel>;
  getAccountExternalCollection(collection: AccountWidgetCollectionModel): void;
  clearAccountExternalCollection(): void;
  getAccountItem(id: number, collections?: string[]): void;
  updateAccountItem(data: IAccountUpdateInput): void;
  clearAccountItem(): void;
  accountCollection: StoreBranch<AccountListCollection>;
  getAccountCollection(collection: AccountListCollection): void;
  initAccountCollection(): void;
  accountDashboard: StoreBranch<DashboardAccount[]>;
  getAccountDashboard(entityId: number): void;
  accountExternalItem: StoreBranch<PendingExternalAccount>;
  getAccountExternalItem(id: number): void;
  approveAccountExternalItem(id: number): void;
  declineAccountExternalItem(id: number): void;
  clearAccountExternalItem(): void;
  approveAccountFiles(paths: string[]): void;
}

function* redirect() {
  yield put(push('/#pending-external-accounts'));
}

function* updateExternalItem(response: any, payload: any, branchState: any, fullState: any) {
  yield put({ type: getStartType('account', 'externalItem', actionsTypes.get), payload: fullState.account.externalItem.params });
}

const externalItemAPIProviders = APIProviderGroup.create()
  .afterSuccess(redirect)
  .add(builder =>
    builder
      .setType('approve')
      .setHandler(accountTransport.approveExternalAccount)
      .hydrateTo(Test)
      .build()
  )
  .add(builder =>
    builder
      .setType('decline')
      .setHandler(accountTransport.declineExternalAccount)
      .build()
  )
  .build();

const collectionAPIProviders = APIProviderGroup.create()
  .add(builder =>
    builder
      .setType(actionsTypes.get)
      .setHandler(accountTransport.requestList)
      .clearBranchParams()
      .build()
  )
  .add(builder =>
    builder
      .setType('actionsTypes.init')
      .setHandler(async () => new AccountListCollection())
      .build()
  )
  .build();

const itemAPIProviders = APIProviderGroup.create()
  .add(builder =>
    builder
      .setType(actionsTypes.get)
      .setHandler(accountTransport.requestItem)
      .build()
  )
  .add(builder =>
    builder
      .setType(actionsTypes.update)
      .setHandler(accountTransport.updateItem)
      .build()
  )
  .build();

const { reducers: accountReducers, sagas: accountSagas, injector: accountInjector } = new CommunicationBuilder()
  .setNamespace('account')
  .addBranch(
    'externalCollection',
    APIProviderBuilder.create()
      .setType(actionsTypes.get)
      .setHandler(accountTransport.requestExternalAccountsCollection)
      .clearBranchParams()
      .build(),
    new AccountWidgetCollectionModel(new AccountWidgetFilterModel(true))
  )
  .addBranch('externalItem', [
    ...externalItemAPIProviders,
    new APIProvider(actionsTypes.get, accountTransport.requestPendingExternalItem)
  ])
  .addBranch(
    'files',
    APIProviderBuilder.create()
      .setType('approve')
      .setHandler(accountTransport.approveFiles)
      .afterSuccess(updateExternalItem)
      .build()
  )
  .addBranch('item', itemAPIProviders)
  .addBranch('collection', collectionAPIProviders, new AccountListCollection())
  .addBranch('dashboard', new APIProvider(actionsTypes.get, accountTransport.getDashboardAccounts), [])
  .addSaga(accountChange())
  .addSaga(accountApplicationChange())
  .build<IAccountConnectedProps>();

export { accountReducers, accountSagas, accountInjector };
```
