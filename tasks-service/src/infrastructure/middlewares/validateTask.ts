import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateTask: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).json({ message: 'Title and description are required.' });
    return;  // Exit the function
  }
  next();
};

export const validateUpdateTask: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'Task id is required.' });
    return;  // Exit the function
  }
  next();
};