export type CreateUserRequest = {
  googleId: string;
  name: string;
};

export type StoreGeolocationRequest = {
  googleId: string;
  latitude: number;
  longitude: number;
};
