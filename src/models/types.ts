/* eslint-disable no-use-before-define */

export type User = {
  name: string;
  googleId: string;
  mirrors: Mirror[];
  latitude?: number;
  longitude?: number;
};

export type Mirror = {
  user?: User | null;
  code?: string | null;
  hash: string;
};
