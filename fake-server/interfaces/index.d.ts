import {Request} from 'express-serve-static-core';
import {Partial, OfType} from '../../src/interfaces/index';

export interface CustomRequest<TBody, TParams> extends Request {
  body: Partial<TBody>;
  params: OfType<TParams, string>;
}
