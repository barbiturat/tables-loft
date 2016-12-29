import {Request} from 'express-serve-static-core';
import {Partial} from '../../src/interfaces/index';

export interface CustomRequest<TBody> extends Request {
  body: Partial<TBody>;
}
