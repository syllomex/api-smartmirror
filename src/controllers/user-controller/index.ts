import UserModel from '../../models/User';

import { User } from '../../models/types';
import { Route } from '../../types/http';

import { CreateUserRequest, StoreGeolocationRequest } from './types';
import { BadRequest, createController, Handlers } from '../controller';

const create: Route<CreateUserRequest, User> = async (req, res) => {
  try {
    const { googleId, name } = req.body;

    if (!googleId?.length || !name?.length) throw new Error('Dados incopletos.');

    const exists = await UserModel.findOne({ googleId });
    if (exists) throw new Error('Conta Google já utilizada.');

    const user = await UserModel.create({ googleId, name });

    return res.status(201).json({
      success: true,
      data: user,
      message: 'Usuário cadastrado!',
    });
  } catch (err) {
    if (!(err instanceof Error)) {
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error', message: 'Erro interno.' });
    }

    return res.status(400).json({
      error: err.message,
      message: 'Não foi possível cadastrar o usuário.',
      success: false,
    });
  }
};

const storeGeolocation: Route<StoreGeolocationRequest> = async (req, res) => {
  const { googleId, latitude, longitude } = req.body;

  if (!googleId) throw new BadRequest('ID de usuário não informado.');
  if (!latitude || !longitude) throw new BadRequest('Latitude ou longitude não inforamdas.');

  const user = await UserModel.findOneAndUpdate(
    { googleId },
    { latitude, longitude },
    { new: true },
  );

  return res.json({ success: true, data: { user } });
};

const userController: Handlers = {
  create,
  storeGeolocation: async (req, res) => createController(storeGeolocation, req, res),
};

export default userController;
