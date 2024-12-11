import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
};

export default errorHandler;


// Include error handling for scenarios like missing items or connection issues
