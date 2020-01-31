import { StoreBranch } from '@axmit/redux-communications';

export enum EGender {
  male = 'male',
  female = 'female'
}

export enum EUserActionsTypes {
  follow = 'follow',
  unFollow = 'unfollow'
}

export interface IUserModel {
  id: number;
  firstName: string;
  lastName: string;
  gender: EGender;
  age: number;
}

export interface IUserCollection extends Array<IUserModel> {}

export interface IUserResponse {
  default: IUserCollection;
}

export interface IUserConnectedProps {
  userCollection: StoreBranch<IUserCollection>;
  userFollowers: StoreBranch<IUserCollection>;
  getUserCollection(): void;
  getUserFollowers(): void;
  followUserModel(params: IUserModel): void;
  unfollowUserModel(params: IUserModel): void;
  deleteUserModel(id: number): void;
}
