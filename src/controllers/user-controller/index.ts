import UserModel from '../../models/User';

import { User } from '../../models/types';
import { Route } from '../../types/http';

import { CreateUserRequest } from './types';

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

const userController = {
  create,
};

export default userController;
