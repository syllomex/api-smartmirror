import http from 'http';
import { Server } from 'socket.io';
import { Application } from 'express';

const init = (app: Application) => {
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });

  return { io, server };
};

const socket = {
  init,
};

export default socket;
