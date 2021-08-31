import express from 'express';

const app = express();

app.get('/', (_req, res) => res.json({ hello: 'world' }));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('running server on port', PORT);
});
