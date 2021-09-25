export type CreateUserRequest = {
  googleId: string;
  name: string;
};

export type StoreGeolocationRequest = {
  id: string;
  latitude: number;
  longitude: number;
};
