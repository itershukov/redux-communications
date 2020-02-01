import { takeEvery, call, put, select } from 'redux-saga/effects';

import { getFailType, getStartType, getSuccessType } from './helpers';
import { IAction, IFullState, INewable } from './types';
import { StoreBranch } from './models/StoreBranch';
import { APIProvider, IAPIProviderHooks } from './models/APIProvider';

export function buildReducer<Data = object, Params = any, Errors = any>(
  namespace: string,
  branchName: string,
  type: string,
  initialState: StoreBranch<Data, Params, Errors>,
  providerHooks: IAPIProviderHooks<Data, Params, Errors> = {}
) {
  const startActionType = getStartType(namespace, branchName, type),
    successActionType = getSuccessType(namespace, branchName, type),
    failActionType = getFailType(namespace, branchName, type);

  return {
    [startActionType]: (state: IFullState<StoreBranch<Data, Params, Errors>>, action: IAction<Params>) => {
      let data = initialState.data; // state[branchName] && state[branchName].data;
      let errors = initialState.errors; // state[branchName].errors;
      if (providerHooks.preRequestDataMapper) {
        data = providerHooks.preRequestDataMapper(null, action.payload, state[branchName], state);
      }

      return {
        ...state,
        [branchName]: new StoreBranch(data, action.payload, errors, true)
      };
    },
    [successActionType]: (state: IFullState<StoreBranch<Data, Params, Errors>>, action: IAction<Data>) => {
      return {
        ...state,
        [branchName]: new StoreBranch(
          action.payload,
          providerHooks.clearParams ? null : state[branchName] && state[branchName].params
        )
      };
    },
    [failActionType]: (state: IFullState<StoreBranch<Data, Params, Errors>>, action: IAction<Errors>) => {
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

export function buildSaga<Data, Params, Errors>(namespace: string, branchName: string, apiProvider: APIProvider<Data, Params, Errors>) {
  const saga = function*(): IterableIterator<unknown> {
    const { type, hooks, effectHandler = takeEvery } = apiProvider;
    const { mapSuccess, mapFail, onSuccess, onFail, onStart, mapParams, hydrateTo } = hooks;

    const actionType = getStartType(namespace, branchName, type);
    yield effectHandler(actionType, function*(action: IAction<Params>) {
      const fullState: IFullState<StoreBranch<Data, Params, Errors>> = yield select(state => state);
      const branchState: StoreBranch<Data, Params, Errors> | null = (fullState && fullState[namespace] && fullState[namespace][branchName]) || null;

      if (!branchState){
        throw new Error(`Branch ${branchName} in namespace ${namespace} not defined`);
      }

      try {
        if (onStart) {
          yield call(onStart, action.payload, branchState, fullState);
        }

        const params = mapParams ? yield call(mapParams, action.payload, branchState, fullState) : action.payload;

        const response = yield call(apiProvider.handler, params);

        const formattedResponse = mapSuccess
          ? yield call(mapSuccess, response, action.payload, branchState, fullState)
          : response;

        const hydratedResponse = hydrateTo ? hydrateResponse(formattedResponse, hydrateTo) : formattedResponse;

        yield put({ type: getSuccessType(namespace, branchName, type), payload: hydratedResponse });

        if (onSuccess) {
          yield call(onSuccess, hydratedResponse as Data, action.payload, branchState, fullState);
        }

        if (action.cb) {
          action.cb(null, hydratedResponse as Data);
        }
      } catch (e) {
        const error = e || new Error('Something went wrong. Please check network connection.');

        const formattedError: Errors = mapFail
          ? yield call(mapFail, error, action.payload, branchState, fullState)
          : error;

        yield put({ type: getFailType(namespace, branchName, type), payload: formattedError });

        if (onFail) {
          yield call(onFail, formattedError, action.payload, branchState, fullState);
        }

        if (action.cb) {
          action.cb(formattedError, null);
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
