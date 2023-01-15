import EventEmitter from 'node:events';
import http from 'node:http';

enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

interface Endpoints {
  '/api/users'?: {
    GET?: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void;
    PUT?: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void;
    POST?: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void;
    DELETE?: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void;
  };
}

const emitter = new EventEmitter();

export class Router {
  endpoints: Endpoints;

  constructor() {
    this.endpoints = {};
  }

  request(
    method: HttpMethod = HttpMethod.GET,
    path: keyof Endpoints,
    handler: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void,
  ) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
      console.log(this.endpoints);

      // throw new Error(` ${path} не существует `);
    }

    const endpoint = this.endpoints[path];

    if (endpoint[method]) {
      throw new Error(`[${method}] по адресу ${path} уже существует `);
    }

    endpoint[method] = handler;

    emitter.on(
      `${path}:${method}`,
      (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
        handler(req, res);
      },
    );
  }

  get(
    path: keyof Endpoints,
    handler: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void,
  ) {
    this.request('GET', path, handler);
  }

  put(
    path: keyof Endpoints,
    handler: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void,
  ) {
    this.request('PUT', path, handler);
  }

  post(
    path: keyof Endpoints,
    handler: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void,
  ) {
    this.request('POST', path, handler);
  }

  delete(
    path: keyof Endpoints,
    handler: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void,
  ) {
    this.request('DELETE', path, handler);
  }
}
