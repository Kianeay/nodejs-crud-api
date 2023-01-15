import { Request } from './Request.type';
import { Response } from './Response.type';

export type HttpMethodHandler = (req: Request, res: Response) => void;
