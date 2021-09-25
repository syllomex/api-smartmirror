import Express from 'express';

export type Request<Body = any> = Express.Request<any, any, Body>;

export type Response<Data> = Express.Response<
  | { success: true; data: Data; message?: string }
  | { success: false; error: string; message?: string }
>;

export type Route<Body = any, Data = any> = (
  req: Request<Partial<Body>>,
  res: Response<Data>,
) => Promise<any>;
