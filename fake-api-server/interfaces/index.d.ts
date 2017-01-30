import {Request} from 'express-serve-static-core';
import {Partial, OfType} from '../../src/interfaces/index';

export interface CustomRequest<TBody, TParams, TQuery> extends Request {
  readonly body: Partial<TBody>;
  readonly params: OfType<TParams, string>;
  readonly query: TQuery;
}
