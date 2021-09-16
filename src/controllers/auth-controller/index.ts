import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { Route } from '../../types/http';
import { SignInRequest, SignInResponse, StoreGoogleTokenRequest } from './types';

const signIn: Route<SignInRequest, SignInResponse> = async (req, res) => {
  try {
    const { googleId } = req.body;

    if (!googleId) throw new Error('Google ID não informado.');

    const user = await User.findOne({ googleId });
    if (!user) throw new Error('Usuário não encontrado.');

    const token = jwt.sign({ user }, process.env.JWT_SECRET || 'teste123', { expiresIn: '90d' });

    return res.json({ success: true, data: { accessToken: token, user } });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error', message: 'Erro interno.' });
    }

    return res
      .status(400)
      .json({ success: false, error: error.message, message: 'Login mal sucedido.' });
  }
};

const storeToken: Route<StoreGoogleTokenRequest, {}> = async (req, res) => {
  try {
    const {
      googleId, name, accessToken, refreshToken,
    } = req.body;

    const user = (async () => {
      const exists = await User.findOne({ googleId });

      if (exists) {
        await exists.update({ googleAccessToken: accessToken, googleRefreshToken: refreshToken });
        return exists;
      }

      return User.create({
        name,
        googleId,
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
      });
    })();

    return res.json({ data: user, success: true, message: 'Token adicionado!' });
  } catch (err) {
    if (!(err instanceof Error)) {
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error', message: 'Erro interno.' });
    }

    return res.json({
      success: false,
      error: err.message,
      message: 'Não foi possível adicionar o token.',
    });
  }
};

export default {
  signIn,
  storeToken,
};
