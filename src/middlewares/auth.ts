import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (
    typeof authorization !== 'string'
    || !authorization?.length
    || !authorization.startsWith('Bearer ')
  ) {
    return res.status(401).json({ success: false, message: 'Token mal formado.' });
  }

  const [_bearer, token] = authorization.split(' ');

  const valid = jwt.verify(token, 'teste123');
  if (!valid) return res.status(401).json({ success: false, message: 'Token inválido.' });

  jwt.decode(token);

  return next();
};

export default {
  isLoggedIn,
};
