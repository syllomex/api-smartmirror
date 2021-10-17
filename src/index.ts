/* eslint-disable import/first */
import cors from 'cors';
import dotenv from 'dotenv';

import connect from './config/mongoose';
import { app, server } from './server';
import events from './events';

dotenv.config();

import router from './routes';

connect();

// const isDev = process.env.NODE_ENV === 'development';
app.use(cors());
app.use(router);

events.init();

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('running server on port', PORT);
});
