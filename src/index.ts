import express from 'express';
import cors from 'cors';
import connect from './config/mongoose';

import 'dotenv';

import router from './routes';

const app = express();

connect();

app.use(
  cors({
    origin: 'https://smartmirror-display.vercel.app',
    allowedHeaders: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('running server on port', PORT);
});
