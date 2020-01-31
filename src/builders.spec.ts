import { expect } from 'chai';
import { buildReducer, buildActionCreator, buildSaga } from './builders';
import { APIProvider } from './models/APIProvider';

describe('Check reducer base builder', () => {
  it('should return reducers was created', () => {
    const reducer = buildReducer('namespace', 'branchName', 'type');

    expect(reducer).exist;
  });

  describe('Check reducer target action handling first time', () => {
    it('Reducer should handle TRY actions', () => {
      const initialState = {
        test: 1
      };

      const reducer = buildReducer('namespace', 'branchName', 'type');

      const actualState = reducer['NAMESPACE_BRANCHNAME_TYPE_TRY'](initialState, {
        type: 'NAMESPACE_BRANCHNAME_TYPE_TRY',
        payload: { a: 1, b: 2 }
      });

      const expectedState = {
        test: 1,
        branchName: {
          loading: true,
          errors: null,
          params: { a: 1, b: 2 },
          data: null
        }
      };

      expect(actualState).deep.equal(expectedState);
    });

    it('Reducer should handle SUCCESS actions', () => {
      const initialState = {
        test: 1
      };

      const reducer = buildReducer('namespace', 'branchName', 'type');

      const actualState = reducer['NAMESPACE_BRANCHNAME_TYPE_SUCCESS'](initialState, {
        type: 'NAMESPACE_BRANCHNAME_TYPE_SUCCESS',
        payload: { a: 1, b: 2 }
      });

      const expectedState = {
        test: 1,
        branchName: {
          loading: false,
          errors: null,
          params: null,
          data: { a: 1, b: 2 }
        }
      };

      expect(actualState).deep.equal(expectedState);
    });

    it('Reducer should handle FAIL actions', () => {
      const initialState = {
        test: 1
      };

      const reducer = buildReducer('namespace', 'branchName', 'type');

      const actualState = reducer['NAMESPACE_BRANCHNAME_TYPE_FAIL'](initialState, {
        type: 'NAMESPACE_BRANCHNAME_TYPE_FAIL',
        payload: { a: 1, b: 2 }
      });

      const expectedState = {
        test: 1,
        branchName: {
          loading: false,
          params: null,
          errors: { a: 1, b: 2 },
          data: null
        }
      };

      expect(actualState).deep.equal(expectedState);
    });
  });

  describe('Check reducer target action handling', () => {
    it('Reducer should handle TRY actions', () => {
      const initialState = {
        test: 1,
        branchName: {
          loading: false,
          errors: {},
          data: { a: 1, b: 2 }
        }
      };

      const reducer = buildReducer('namespace', 'branchName', 'type');

      const actualState = reducer['NAMESPACE_BRANCHNAME_TYPE_TRY'](initialState, {
        type: 'NAMESPACE_BRANCHNAME_TYPE_TRY',
        payload: { a: 2, b: 2 }
      });

      const expectedState = {
        test: 1,
        branchName: {
          loading: true,
          errors: null,
          data: { a: 1, b: 2 },
          params: { a: 2, b: 2 }
        }
      };

      expect(actualState).deep.equal(expectedState);
    });

    it('Reducer should handle SUCCESS actions', () => {
      const initialState = {
        test: 1,
        branchName: {
          loading: true,
          errors: [],
          data: { a: 1 }
        }
      };

      const reducer = buildReducer('namespace', 'branchName', 'type');

      const actualState = reducer['NAMESPACE_BRANCHNAME_TYPE_SUCCESS'](initialState, {
        type: 'NAMESPACE_BRANCHNAME_TYPE_SUCCESS',
        payload: { a: 1, b: 2 }
      });

      const expectedState = {
        test: 1,
        branchName: {
          loading: false,
          errors: null,
          params: null,
          data: { a: 1, b: 2 }
        }
      };

      expect(actualState).deep.equal(expectedState);
    });

    it('Reducer should handle FAIL actions', () => {
      const initialState = {
        test: 1,
        branchName: {
          loading: true,
          data: { a: 2, b: 1 },
          errors: { a: 1, b: 2 }
        }
      };

      const reducer = buildReducer('namespace', 'branchName', 'type');

      const actualState = reducer['NAMESPACE_BRANCHNAME_TYPE_FAIL'](initialState, {
        type: 'NAMESPACE_BRANCHNAME_TYPE_FAIL',
        payload: { a: 1, b: 2 }
      });

      const expectedState = {
        test: 1,
        branchName: {
          loading: false,
          params: null,
          errors: { a: 1, b: 2 },
          data: { a: 2, b: 1 }
        }
      };

      expect(actualState).deep.equal(expectedState);
    });
  });
});

describe('Check action creator builder', () => {
  it('Base check for action creator builder', () => {
    const creator = buildActionCreator('ACTION_TYPE');

    expect(creator).exist;
  });

  it('Base check for action creator builder', () => {
    const creator = buildActionCreator('ACTION_TYPE');

    const expected = { type: 'ACTION_TYPE', payload: { test: 'data' } };

    const actual = creator({ test: 'data' });

    expect(expected).deep.equal(actual);
  });
});

describe('Check saga builder', () => {
  it('Base check for saga builder', () => {
    const saga = buildSaga('user', 'model', new APIProvider('get', () => []));

    expect(saga).exist;
  });
});
