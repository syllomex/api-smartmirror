import express from 'express';
// import cors from 'cors';
import connect from './config/mongoose';

import 'dotenv';

import router from './routes';

const app = express();

connect();

// const isDev = process.env.NODE_ENV === 'development';

// app.use(
//   cors({
//     origin: isDev ? 'http://localhost:3000' : 'https://smartmirror-display.vercel.app',
//     credentials: true,
//     allowedHeaders: '*',
//   }),
// );

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://smartmirror-display.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', '1');

  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('running server on port', PORT);
});
