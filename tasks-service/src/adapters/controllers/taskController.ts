import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createTaskService, getAllTasks } from '../../application/services/taskService';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../domain/models/taskModel';

interface TaskBody {
    title: string;
    description?: string;
  }


export const createTask: RequestHandler<{}, {}, TaskBody> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const task = await createTaskService(newTask);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      //to implement
      res.json([]);
    } catch (error) {
      next(error);
    }
  };

  export const updateTask = async (_req: Request, res: Response, next: NextFunction) => {
    try {
       //to implement
      res.json([]);
    } catch (error) {
      next(error);
    }
  };

  export const deleteTask = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      //to implement
      res.json([]);
    } catch (error) {
      next(error);
    }
  };
