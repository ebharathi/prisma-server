import { Request,Response,NextFunction } from "express";


export const asyncWrapper = (
    asyncFn: (req: Request, res: Response) => Promise<any>
  ) => {
    return function(req: Request, res: Response, next: NextFunction) {
      asyncFn(req, res).catch(next);
    };
  };
  