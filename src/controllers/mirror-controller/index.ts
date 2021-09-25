import { v4 } from 'uuid';
import MirrorModel from '../../models/Mirror';
import UserModel from '../../models/User';

import { Route } from '../../types/http';
import {
  BadRequest, createController, Handlers, NotFound,
} from '../controller';

const create: Route<{ code?: string }> = async (req, res) => {
  const { code } = req.body;

  if (!code?.length || code.length !== 6) throw new BadRequest('Código inválido.');

  const exists = await MirrorModel.findOne({ code });
  if (exists) throw new BadRequest('Código indisponível.');

  const hash = v4();

  const newMirror = await MirrorModel.create({ code, hash });

  return res.status(201).json({
    success: true,
    data: newMirror,
    message: 'Espelho criado!',
  });
};

const show: Route<{ hash: string }> = async (req, res) => {
  const { hash } = req.query;
  if (!hash?.length || typeof hash !== 'string') throw new BadRequest('Hash inválida.');

  const mirror = await MirrorModel.findOne({ hash }).populate('user');

  if (!mirror) throw new NotFound('Espelho não encontrado.');

  return res.json({ success: true, data: mirror });
};

const connect: Route<{ code?: string; googleId?: string }> = async (req, res) => {
  const { code, googleId } = req.body;

  if (!code?.length) throw new BadRequest('Código inválido.');
  if (!googleId?.length) throw new BadRequest('Google ID não informado.');

  const user = await UserModel.findOne({ googleId });
  if (!user) throw new NotFound('Usuário não encontrado.');

  const mirror = await MirrorModel.findOneAndUpdate(
    { code },
    { user: user._id, code: null },
    { new: true },
  );
  if (!mirror) throw new BadRequest('Espelho não encontrado.');

  return res.json({
    success: true,
    data: mirror,
    message: 'Espelho conectado!',
  });
};

const disconnect: Route<{ hash?: string }> = async (req, res) => {
  const { hash } = req.query;

  if (!hash?.length || typeof hash !== 'string') throw new BadRequest('Hash não informado.');

  const mirror = await MirrorModel.findOneAndDelete({ hash });
  if (!mirror) throw new NotFound('Espelho não encontrado.');

  return res.json({
    success: true,
    data: null,
    message: 'Espelho desconectado!',
  });
};

const isConnected: Route<{ hash?: string }> = async (req, res) => {
  const { hash } = req.query;

  if (!hash?.length || typeof hash !== 'string') throw new BadRequest('Hash não informado.');

  const mirror = await MirrorModel.findOne({ hash });

  return res.json({ success: true, data: { connected: !!mirror } });
};

const handlers: Handlers = {
  create: async (req, res) => createController(create, req, res),
  show: async (req, res) => createController(show, req, res),
  connect: async (req, res) => createController(connect, req, res),
  disconnect: async (req, res) => createController(disconnect, req, res),
  isConnected: async (req, res) => createController(isConnected, req, res),
};

export default handlers;
