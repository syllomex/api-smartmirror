import express from 'express';
import socket from './config/socket';

const app = express();

const { io, server } = socket.init(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export { app, io, server };
