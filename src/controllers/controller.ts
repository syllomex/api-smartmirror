/* eslint-disable max-classes-per-file */
import { Request, Response, Route } from '../types/http';

class BadRequest extends Error {
  public status = 400;
}

class NotFound extends Error {
  public status = 404;
}

class Unauthorized extends Error {
  public status = 401;
}

class InternalServerError extends Error {
  public status = 500;
}

const createController = async (handler: Route, req: Request, res: Response<any>) => {
  try {
    const response = await handler(req, res);
    return response;
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, error: err, message: err.message });
  }
};

export {
  createController, BadRequest, NotFound, Unauthorized, InternalServerError,
};
