import { Request, Response, NextFunction } from 'express';

import { createTaskService } from '../../core/services/taskService';
import { DynamoDBTaskRepository } from '../../infrastructure/database/DynamoDBTaskRepository';
import { Task } from '../../core/domain/entities/taskModel';

const taskRepository = new DynamoDBTaskRepository();
const createTaskUseCase = new createTaskService(taskRepository);

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const task = new Task(new Date().getTime().toString(), title, description);
    await createTaskUseCase.execute(task);
    res.status(201).json(task);
  } catch (error) {
    next(error);
    //res.status(500).json({ error: 'Error creating task' });
  }
};

export const getTasks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json([]);
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