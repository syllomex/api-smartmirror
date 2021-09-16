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
    if (
      err instanceof BadRequest
      || err instanceof Unauthorized
      || err instanceof InternalServerError
      || err instanceof NotFound
    ) {
      return res
        .status(err.status || 500)
        .json({ success: false, error: err.message, message: err.message });
    }

    if (err instanceof Error) {
      return res
        .status(500)
        .json({ success: false, error: err.message, message: 'Erro interno do servidor.' });
    }

    return res
      .status(500)
      .json({
        success: false,
        error: 'Internal server error',
        message: 'Erro interno do servidor.',
      });
  }
};

export {
  createController, BadRequest, NotFound, Unauthorized, InternalServerError,
};
