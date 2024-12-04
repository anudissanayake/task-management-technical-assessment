import { Request, Response, NextFunction } from 'express';

import { createTaskService, getTaskService, getTaskByIdService, updateTaskService, deleteTaskService } from '../../core/services/taskService';
import { DynamoDBTaskRepository } from '../../infrastructure/database/DynamoDBTaskRepository';
import { Task } from '../../core/domain/entities/taskModel';
import { uploadFile } from '../../infrastructure/s3/S3Service';

const taskRepository = new DynamoDBTaskRepository();
const createTaskUseCase = new createTaskService(taskRepository);

const getTaskUseCase = new getTaskService(taskRepository);

const getTaskByIdUseCase = new getTaskByIdService(taskRepository);

const updateTaskUseCase = new updateTaskService(taskRepository);

const deleteTaskUseCase = new deleteTaskService(taskRepository);

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const task = new Task(new Date().getTime().toString(), title, description);
    //s3 file upload
    if(req.body.file && req.body.fileName) {
      const fileUrl = await uploadFile(req.body.file, req.body.fileName);
      task.fileUrl = fileUrl;
    }
    await createTaskUseCase.execute(task);
    res.status(201).json(task);
  } catch (error) {
    next(error);
    //res.status(500).json({ error: 'Error creating task' });
  }
};

export const getTasks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await getTaskUseCase.execute();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.id; 
      const tasks = await getTaskByIdUseCase.execute(uuid);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.id;// Extract the task ID from URL parameters
      const { title, description, status } = req.body; // Extract task data from request body
      const task = await getTaskByIdUseCase.execute(uuid); // Get the task by ID using the use case

      // If the task does not exist, return a 404 Not Found
      if (!task) {
        res.status(404).json({message: "Task not found"});
        return;
      }
      const updatedTask: Task = {
        ...task,
        title: title || task.title,
        description: description || task.description,
        status: status || task.status,
        updatedAt: new Date().toISOString() 
      }

      // Update the task using the update use case
      await updateTaskUseCase.execute(updatedTask);
      res.status(200).json(updatedTask);
      
    } catch (error) {
      next(error);
    }
  };

  export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.id; 
      await deleteTaskUseCase.execute(uuid);
      res.status(200).json({message:"Deleted successfully"});
    } catch (error) {
      next(error);
    }
  };