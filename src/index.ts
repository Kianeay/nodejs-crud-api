import EventEmitter from 'node:events';
import http from 'node:http';

import { Router } from './router';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const PORT = process.env.PORT || 4000;

const emitter = new EventEmitter();
const router = new Router();

router.get('/api/users', (req, res) => {
  res.end('users 200');
});

const server = http.createServer(async (req, res) => {
  // res.writeHead(200, { 'Content-Type': 'application/json' });

  const emitted = emitter.emit(`${req.url}:${req.method}`, req, res);

  if (!emitted) {
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
