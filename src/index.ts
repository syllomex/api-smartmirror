import express from 'express';
import cors from 'cors';
import connect from './config/mongoose';

import 'dotenv';

import router from './routes';

const app = express();

connect();

const isDev = process.env.NODE_ENV === 'development';

app.use(
  cors({
    origin: isDev ? 'http://localhost:3000' : 'https://smartmirror-display.vercel.app',
    credentials: true,
  }),
);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json',
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('running server on port', PORT);
});
