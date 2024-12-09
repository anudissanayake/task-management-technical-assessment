// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { fetchUsers } from '../services/ExternalApiService';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};