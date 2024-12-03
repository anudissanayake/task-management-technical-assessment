import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateTask: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: 'Title and description are required.' });  // Send response and terminate early
    return;  // Important: Exit the function
  }
  next();
};