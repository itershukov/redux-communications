import { History } from 'history';
import { connectRouter } from 'connected-react-router';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore as createReduxStore, Reducer } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers, { IApplicationState } from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const createStore = (initialState: IApplicationState, history: History) => {
  // Middleware Configuration
  const middleware = [sagaMiddleware, routerMiddleware(history)];

  // Store Enhancers
  const windowObject = window as any;
  let composeEnhancers = compose;

  if (process.env.NODE_ENV === 'development') {
    if (typeof windowObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = windowObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  try {
    // it's safe to use window now
    (reducers as any).router = connectRouter(history);
  } catch (e) {}

  // Store Instantiation
  const storeReducers: Reducer<IApplicationState> = combineReducers<IApplicationState>({
    ...reducers
  } as any);

  const rootReducer: Reducer<IApplicationState> = (state, action) => {
    return storeReducers(state, action);
  };
  const store = createReduxStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middleware)));

  sagaMiddleware.run(rootSaga);

  return store;
};

export default createStore;
