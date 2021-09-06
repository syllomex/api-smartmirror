import { User } from '../../models/types';

export type SignInRequest = {
  googleId: string;
};

export type SignInResponse = {
  accessToken: string;
  user: User;
};

export type StoreGoogleTokenRequest = {
  googleId: string;
  accessToken: string;
  refreshToken?: string;
  name?: string;
};
