import EventEmitter from 'node:events';

import { HttpMethod, HttpMethodHandler, Request, Response } from './common';

interface Endpoints {
  '/api/users'?: Partial<Record<HttpMethod, HttpMethodHandler>>;
}

const emitter = new EventEmitter();

export class Router {
  endpoints: Endpoints;

  constructor() {
    this.endpoints = {};
  }

  request(method: HttpMethod = HttpMethod.GET, path: keyof Endpoints, handler: HttpMethodHandler) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};

      // throw new Error(` ${path} не существует `);
    }

    const endpoint = this.endpoints[path];

    if (endpoint) {
      if (endpoint[method]) {
        throw new Error(`[${method}] по адресу ${path} уже существует `);
      }

      endpoint[method] = handler;
    }

    emitter.on(`${path}:${method}`, (req: Request, res: Response) => {
      handler(req, res);
    });
  }

  get(path: keyof Endpoints, handler: HttpMethodHandler) {
    this.request(HttpMethod.GET, path, handler);
  }

  put(path: keyof Endpoints, handler: HttpMethodHandler) {
    this.request(HttpMethod.PUT, path, handler);
  }

  post(path: keyof Endpoints, handler: HttpMethodHandler) {
    this.request(HttpMethod.POST, path, handler);
  }

  delete(path: keyof Endpoints, handler: HttpMethodHandler) {
    this.request(HttpMethod.DELETE, path, handler);
  }
}
