import { NotFound } from '../controllers/controller';
import MirrorModel from '../models/Mirror';
import UserModel from '../models/User';
import { io } from '../server';

const init = () => {
  io.on('connection', async (socket) => {
    socket.on(
      'from-app.connect',
      async ({ code, googleId }: { code: string; googleId: string }) => {
        const user = await UserModel.findOne({ googleId });
        if (!user) throw new NotFound('Usuário não encontrado.');

        const mirror = await MirrorModel.findOneAndUpdate(
          { code },
          { user: user._id, code: null },
          { new: true },
        );

        const data = await MirrorModel.findOne({ hash: mirror?.hash }).populate('user');

        io.emit(`from-server.connect:${code}`, data);
      },
    );

    socket.on(
      'from-app.toggle-widget',
      async (args: { hash?: string; widget?: { name: string; status: boolean } }) => {
        const { hash, widget } = args;

        const error = (msg: string) => socket.emit(`from-server.toggle-widget:${hash}`, { error: msg });

        if (!hash) return error('Hash não informada.');
        if (!widget) return error('Widget não informado.');

        const mirror = await MirrorModel.findOne({ hash });
        if (!mirror) return error('Espelho não encontrado.');

        const { widgets } = mirror;

        const updated = (() => {
          if (widget.status && !widgets.includes(widget.name)) {
            return [...widgets, widget.name];
          }

          if (!widget.status && widgets.includes(widget.name)) {
            return widgets.filter((name) => name !== widget.name);
          }

          return widgets;
        })();

        const result = await MirrorModel.findOneAndUpdate(
          { hash },
          { widgets: updated },
          { new: true },
        );

        if (!result) return error('Não foi possível atualizar os widgets.');

        io.emit(`from-server.get-widgets:${hash}`, { widgets: result.widgets || [] });

        return null;
      },
    );

    socket.on('from-app-web.get-widgets', async (args: { hash?: string }) => {
      const { hash } = args;

      const error = (msg: string) => socket.emit(`from-server.get-widgets:${hash}`, { error: msg });

      if (!hash) return error('Hash não informada.');

      const data = await MirrorModel.findOne({ hash });
      if (!data) return error('Espelho não encontrado.');

      socket.emit(`from-server.get-widgets:${hash}`, { widgets: data.widgets || [] });
      return null;
    });

    socket.on('from-web.check-connection', async (args: { hash?: string }) => {
      const { hash } = args;
      if (!hash) return;

      const mirror = await MirrorModel.findOne({ hash });
      if (!mirror) io.emit(`from-server.disconnect:${hash}`);
    });

    socket.on('from-app.disconnect', async (args: { hash?: string }) => {
      const { hash } = args;
      io.emit(`from-server.disconnect:${hash}`);

      if (!hash?.length || typeof hash !== 'string') return;

      await MirrorModel.findOneAndDelete({ hash });
    });
  });
};

// eslint-disable-next-line no-console
console.log('listening socket events');

const events = {
  init,
};

export default events;
