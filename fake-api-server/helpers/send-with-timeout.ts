import {
  RequestHandler,
  Request,
  Response,
  NextFunction
} from 'express-serve-static-core';

const sendWithTimeout = (
  timeout: number,
  handler: RequestHandler
): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  setTimeout(function() {
    handler(req, res, next);
  }, timeout);
};

export default sendWithTimeout;
