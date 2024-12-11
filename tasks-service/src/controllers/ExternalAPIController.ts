import { Request, Response, NextFunction } from 'express';
import { fetchUsers } from '../services/ExternalApiService';

/**
 * Implemented to fetch data from an external API
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};