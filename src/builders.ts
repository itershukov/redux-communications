import { takeEvery, call, put, select } from 'redux-saga/effects';

import { getFailType, getStartType, getSuccessType } from './helpers';
import { IAction, IFullState, INewable } from './types';
import { StoreBranch } from './models/StoreBranch';
import { APIProvider, IAPIProviderHooks } from './models/APIProvider';

export function buildReducer<Data = object, Params = null, Errors = any>(
  namespace: string,
  branchName: string,
  type: string,
  initialState: StoreBranch<Data, Params, Errors>,
  providerHooks: IAPIProviderHooks<any, any> = {}
) {
  const startActionType = getStartType(namespace, branchName, type),
    successActionType = getSuccessType(namespace, branchName, type),
    failActionType = getFailType(namespace, branchName, type);

  return {
    [startActionType]: (state: IFullState, action: IAction<Params>) => {
      let data = initialState.data; // state[branchName] && state[branchName].data;
      if (providerHooks.preRequestDataMapper) {
        data = providerHooks.preRequestDataMapper(null, action.payload, state[branchName], state);
      }

      return {
        ...state,
        [branchName]: new StoreBranch(data, action.payload, initialState.errors, true)
      };
    },
    [successActionType]: (state: IFullState, action: IAction<Data>) => {
      return {
        ...state,
        [branchName]: new StoreBranch(
          action.payload,
          providerHooks.clearParams ? null : state[branchName] && state[branchName].params
        )
      };
    },
    [failActionType]: (state: IFullState, action: IAction<Errors>) => {
      return {
        ...state,
        [branchName]: new StoreBranch(
          state[branchName] && state[branchName].data,
          state[branchName] && state[branchName].params,
          action.payload
        )
      };
    }
  };
}

export function buildSaga(namespace: string, branchName: string, apiProvider: APIProvider) {
  const saga = function*(): IterableIterator<unknown> {
    const { type, hooks, effectHandler = takeEvery } = apiProvider;
    const { responseFormatter, postSuccessHook, postFailHook, preRequestHook, mapParams, hydrateTo } = hooks;

    const actionType = getStartType(namespace, branchName, type);
    yield effectHandler(actionType, function*(action: IAction<unknown>) {
      const fullState = yield select(state => state);
      const branchState = (fullState && fullState[namespace] && fullState[namespace][branchName]) || null;

      try {
        if (preRequestHook) {
          yield call(preRequestHook, null, action.payload, branchState, fullState);
        }

        const params = mapParams ? mapParams(action.payload, branchState, fullState) : action.payload;

        const response = yield call(apiProvider.handler, params);

        const formattedResponse = responseFormatter
          ? yield call(responseFormatter, response, action.payload, branchState, fullState)
          : response;

        const hydratedResponse = hydrateTo ? hydrateResponse(formattedResponse, hydrateTo) : formattedResponse;

        yield put({ type: getSuccessType(namespace, branchName, type), payload: hydratedResponse });

        if (postSuccessHook) {
          yield call(postSuccessHook, response, action.payload, branchState, fullState);
        }

        if (action.cb) {
          action.cb(null, response);
        }
      } catch (error) {
        yield put({ type: getFailType(namespace, branchName, type), payload: error });

        if (postFailHook) {
          yield call(postFailHook, error, action.payload, branchState, fullState);
        }

        if (action.cb) {
          action.cb(error || new Error('Something went wrong. Please check network connection.'));
        }
      }
    });
  };

  return saga();
}

export function buildActionCreator(actionType: string, cb?: (error: unknown, response: unknown) => void) {
  return (data: unknown) => ({ type: actionType, payload: data, cb });
}

function hydrateResponse(response: any, ModelCtor: INewable) {
  return new ModelCtor(response);
}
