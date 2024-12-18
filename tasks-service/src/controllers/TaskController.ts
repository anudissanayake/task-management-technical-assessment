import { Request, Response, NextFunction } from 'express';

import { TaskService } from '../services/TaskService';
import { FileUploadService } from '../services/FileUploadService';
import { Task } from '../core/domain/models/TaskModel';

/**
 * Implemented CRUD operations for Task
 */
export class TaskController {
  private taskService: TaskService;
  private fileUploadService: FileUploadService

  constructor(taskService: TaskService, fileUploadService: FileUploadService) {
    this.taskService = taskService;
    this.fileUploadService = fileUploadService;
  }

  /**
  * @param {Request} req 
  * @param {string} req.body.title 
  * @param {string} req.body.description
  * @param {file} req.file
  * @param {Response} res - object with 201 status code
   */
  public createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { title, description } = req.body;
        const task = new Task(new Date().getTime().toString(), title, description);
        //s3 file upload
        if (req.file) {
          const fileBuffer = req.file.buffer;       // Extract file buffer
          const fileName = req.file.originalname;   // Extract original file name
          const mimeType = req.file.mimetype;       // Extract MIME type
  
          // Upload file to S3
          const fileUrl = await this.fileUploadService.uploadFile(fileBuffer, fileName, mimeType);
          task.fileUrl = fileUrl;  // Store the file URL in the task
        }
        await this.taskService.createTaskService(task);
        res.status(201).json(task);
      } catch (error) {
        next(error);
      }
  }

  /**
  * @param {Request} req 
  * @param {Response} res - Task array with 200 status code
  */
  public getTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getTasksService();
      if (!tasks || tasks.length === 0) {
        res.status(404).json({ message: 'No tasks found.' });
        return;
      }
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  /**
  * @param {Request} req 
  * @param {string} req.params.id 
  * @param {Response} res - Task object with 200 status code
  */
  public getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.id; 
      const task = await this.taskService.getTaskByIdService(uuid);
      if (!task) {
        res.status(404).json({ message: 'Task not found.' });
        return;
      }
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  /**
 * @param {Request} req 
  * @param {string} req.body.title 
  * @param {string} req.body.description
  * @param {file} req.file
  * @param {Response} res - object with 200 status code
   */
  public updateTask = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const uuid = req.params.id;// Extract the task ID from URL parameters
        const { title, description, status } = req.body; // Extract task data from request body
        let fileUrl: string | undefined;
        const taskExist = await this.taskService.getTaskByIdService(uuid);
  
        // If the task does not exist, return a 404 Not Found
        if (!taskExist) {
          res.status(404).json({message: "Task not found"});
          return;
        }
        //s3 file upload
        if (req.file) {
          const fileBuffer = req.file.buffer;       // Extract file buffer
          const fileName = req.file.originalname;   // Extract original file name
          const mimeType = req.file.mimetype;       // Extract MIME type
  
          // Upload file to S3
          fileUrl = await this.fileUploadService.uploadFile(fileBuffer, fileName, mimeType);
        }
        const task: Task = {
          ...taskExist,
          title: title || taskExist.title,
          description: description || taskExist.description,
          status: status || taskExist.status,
          fileUrl: fileUrl || taskExist.fileUrl,
          updatedAt: new Date().toISOString() 
        }
        // Update the task using the update use case
        const updatedTask = await this.taskService.updateTaskService(task);
        res.status(200).json(updatedTask);
        
      } catch (error) {
        next(error);
      }
  };

  /**
  * @param {Request} req 
  * @param {string} req.params.id 
  * @param {Response} res - object with 200 status code
  */
  public deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.id;
      const taskExist = await this.taskService.getTaskByIdService(uuid);
  
        // If the task does not exist, return a 404 Not Found
        if (!taskExist) {
          res.status(404).json({message: "Task not found"});
          return;
        }
        await this.taskService.deleteTaskService(uuid);
      
      if (taskExist?.fileUrl) {
        const key = new URL(taskExist.fileUrl).pathname.substring(1);
        await this.fileUploadService.deleteFile(key);
      }
      res.status(200).json({message:"Task Deleted successfully"});
    } catch (error) {
      next(error);
    }
  }
}