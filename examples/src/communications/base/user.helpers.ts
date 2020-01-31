import { IUserCollection, IUserResponse } from './user.types';

export function userResponseFormatter(response: IUserResponse): IUserCollection {
  return response.default;
}
