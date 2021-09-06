import { v4 } from 'uuid';
import MirrorModel from '../../models/Mirror';
import UserModel from '../../models/User';

import { Route } from '../../types/http';

const create: Route<{ code?: string }> = async (req, res) => {
  try {
    const { code } = req.body;
    console.log(code);
    if (!code?.length) throw new Error('INCOMPLETE_DATA');

    const exists = await MirrorModel.findOne({ code });

    if (exists) {
      return res.json({
        success: false,
        message: 'Código indisponível.',
        error: 'UNAVAILABLE_CODE',
      });
    }

    const hash = v4();

    const newMirror = await MirrorModel.create({ code, hash });

    return res.json({ success: true, data: newMirror, message: 'Espelho criado!' });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
      message: 'Não foi possível criar o espelho.',
    });
  }
};

const show: Route<{ hash: string }> = async (req, res) => {
  try {
    const { hash } = req.query;
    if (!hash?.length || typeof hash !== 'string') throw new Error('INCOMPLETE_DATA');

    const mirror = await MirrorModel.findOne({ hash }).populate('user');

    if (!mirror) {
      return res.status(404).json({
        success: false,
        message: 'Espelho não encontrado.',
        error: 'MIRROR_NOT_FOUND',
      });
    }

    return res.json({ success: true, data: mirror });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
      message: 'Não foi possível obter o espelho.',
    });
  }
};

const connect: Route<{ code?: string; googleId?: string }> = async (req, res) => {
  try {
    const { code, googleId } = req.body;
    console.log(code, googleId);
    if (!code?.length || !googleId?.length) throw new Error('INCOMPLETE_DATA');

    const user = await UserModel.findOne({ googleId });
    if (!user) throw new Error('USER_NOT_FOUND');

    const mirror = await MirrorModel.findOneAndUpdate(
      { code },
      { user: user._id, code: null },
      { new: true },
    );
    if (!mirror) throw new Error('MIRROR_NOT_FOUND');

    return res.json({ success: true, data: mirror, message: 'Espelho conectado!' });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      message: 'Não foi possível conectar ao espelho.',
    });
  }
};

export default {
  create,
  show,
  connect,
};
