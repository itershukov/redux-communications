import {
  capitalize,
  getActionMethodName,
  getAPIMethodName,
  getFailType,
  getStartType,
  getSuccessType,
  getTypePrefix
} from './helpers';
import { expect } from 'chai';

describe('Check helpers', () => {
  it('should return capitalized value', () => {
    const actual = capitalize('xcvxcvdfr regdfg');
    const expected = 'Xcvxcvdfr regdfg';
    expect(actual).equal(expected);
  });
  it('should return capgetitalized value for empty string', () => {
    const actual = capitalize('');
    const expected = '';
    expect(actual).equal(expected);
  });
  it('should return capitalized value for 1 char string', () => {
    const actual = capitalize('x');
    const expected = 'X';
    expect(actual).equal(expected);
  });

  it('should return correct prefix', () => {
    const actual = getTypePrefix('users', 'model', 'get');
    const expected = 'USERS_MODEL_GET';
    expect(actual).equal(expected);
  });

  it('should return TRY prefix', () => {
    const actual = getStartType('users', 'model', 'get');
    const expected = 'USERS_MODEL_GET_TRY';
    expect(actual).equal(expected);
  });
  it('should return SUCCESS prefix', () => {
    const actual = getSuccessType('users', 'model', 'get');
    const expected = 'USERS_MODEL_GET_SUCCESS';
    expect(actual).equal(expected);
  });
  it('should return FAIL prefix', () => {
    const actual = getFailType('users', 'model', 'get');
    const expected = 'USERS_MODEL_GET_FAIL';
    expect(actual).equal(expected);
  });

  it('should return action method name', () => {
    const actual = getActionMethodName('users', 'model', 'get');
    const expected = 'getUsersModel';
    expect(actual).equal(expected);
  });

  describe('Check API helpers', () => {
    it('should return API method name for GET', () => {
      const actual = getAPIMethodName('users', 'model', 'GET');
      const expected = 'getUsersModel';
      expect(actual).equal(expected);
    });
    it('should return API method name for POST', () => {
      const actual = getAPIMethodName('users', 'model', 'POST');
      const expected = 'addUsersModel';
      expect(actual).equal(expected);
    });
    it('should return API method name for PUT', () => {
      const actual = getAPIMethodName('users', 'model', 'PUT');
      const expected = 'updateUsersModel';
      expect(actual).equal(expected);
    });
    it('should return API method name for DELETE', () => {
      const actual = getAPIMethodName('users', 'model', 'DELETE');
      const expected = 'deleteUsersModel';
      expect(actual).equal(expected);
    });
    it('should return API method name for CUSTOM_METHOD', () => {
      const actual = getAPIMethodName('users', 'model', 'CUSTOM_METHOD');
      const expected = 'customMethodUsersModel';
      expect(actual).equal(expected);
    });
  });
});
