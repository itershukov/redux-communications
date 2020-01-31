import { connect } from 'react-redux';

import { IAction, IBuilderConfig, IFullState, IReducers, IStrategy } from '../types';
import { getStateBranchName } from '../helpers';

export class BaseStrategy<InjectedProps> implements IStrategy<InjectedProps> {
  public readonly config: IBuilderConfig;

  constructor(config: IBuilderConfig) {
    this.config = config;
  }

  buildActions() {
    return {};
  }

  public buildReducers() {
    const { namespace, branches } = this.config;

    const reducers: IReducers = branches.reduce(
      (accum, branch) => ({
        ...accum,
        ...branch.buildBranchReducers(namespace)
      }),
      {}
    );

    const res: IReducers = {};

    const initialState = branches.reduce((accumulator: IFullState, branch) => {
      accumulator[branch.name] = branch.initialState;
      return accumulator;
    }, {});

    res[namespace] = (state: IFullState = initialState, action: IAction<unknown>) => {
      return reducers[action.type] ? { ...state, ...reducers[action.type](state, action) } : state;
    };

    return res;
  }

  public buildInjector() {
    const { namespace, branches } = this.config;

    const mapStateToProps = (state: IFullState) => ({
      ...branches.reduce(
        (accum, branch) => ({
          ...accum,
          [getStateBranchName(namespace, branch.name)]: state[namespace][branch.name]
        }),
        {}
      )
    });

    const mapDispatchToProps = dispatch =>
      branches.reduce(
        (accum, next) => ({
          ...accum,
          ...next.buildBranchDispatchers(namespace, dispatch)
        }),
        {}
      );

    return connect(
      mapStateToProps,
      mapDispatchToProps
    );
  }

  public buildSagas() {
    const { namespace, branches, sagas = [] } = this.config;

    const saga = branches.reduce(
      (accum, branch) => {
        const branchSagas = branch.buildBranchSagas(namespace);

        return [...accum, ...branchSagas];
      },
      [] as IterableIterator<unknown>[]
    );

    return [...saga, ...sagas];
  }
}
