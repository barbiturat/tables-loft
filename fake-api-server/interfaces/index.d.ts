import {Request} from 'express-serve-static-core';
import {Partial, OfType} from '../../src/interfaces/index';

export interface CustomRequest<TBody, TParams, TQuery> extends Request {
  body: Partial<TBody>;
  params: OfType<TParams, string>;
  query: TQuery;
}
