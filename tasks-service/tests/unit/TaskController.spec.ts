import { Request, Response, NextFunction } from 'express';

// Import the function and dependencies
import { DynamoDBTaskRepository } from '../../src/infrastructure/database/DynamoDBTaskRepository';
import { TaskController } from '../../src/controllers/TaskController';
import { TaskService } from '../../src/services/TaskService';
import { FileUploadService } from '../../src/services/FileUploadService';
import { Task } from '../../src/core/domain/models/TaskModel';


jest.mock('../../src/services/TaskService');
jest.mock('../../src/services/FileUploadService');

describe('TaskController', () => {
  let taskService: jest.Mocked<TaskService>;
  let fileUploadService: jest.Mocked<FileUploadService>;
  let taskController: TaskController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mocked<NextFunction>;

  beforeEach(() => {
    const taskRepository = new DynamoDBTaskRepository();
    taskService = new TaskService(taskRepository) as jest.Mocked<TaskService>;
    fileUploadService = new FileUploadService() as jest.Mocked<FileUploadService>;
    taskController = new TaskController(taskService, fileUploadService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('createTask', () => {
    it('should create a task and return 201', async () => {
      req.body = { title: 'Test Task', description: 'Test Description' };
      req.file = {
        buffer: Buffer.from('test file'),
        originalname: 'file.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File;

      fileUploadService.uploadFile.mockResolvedValue('https://task-file-bucket.s3.us-east-1.amazonaws.com/1733684781125-TestFile.docx');
      taskService.createTaskService.mockResolvedValue();

      await taskController.createTask(req as Request, res as Response, next);

      expect(fileUploadService.uploadFile).toHaveBeenCalledWith(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      expect(taskService.createTaskService).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
          fileUrl: 'https://task-file-bucket.s3.us-east-1.amazonaws.com/1733684781125-TestFile.docx',
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should create a task without a file and return 201', async () => {
      req.body = { title: 'Test Task', description: 'Test Description' };
      taskService.createTaskService.mockResolvedValue();

      await taskController.createTask(req as Request, res as Response, next);

      expect(taskService.createTaskService).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      req.body = { title: 'Test Task', description: 'Test Description' };
      taskService.createTaskService.mockRejectedValue(new Error('Error'));

      await taskController.createTask(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getTasks', () => {
    it('should return tasks with status 200', async () => {
      const tasks: Task[] = [{ id: '1', title: 'Test', description: '', status: 'pending', createdAt: '', updatedAt: '' }];
      taskService.getTasksService.mockResolvedValue(tasks);

      await taskController.getTasks(req as Request, res as Response, next);

      expect(taskService.getTasksService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task with status 200', async () => {
      const task: Task = { id: '1', title: 'Test', description: '', status: 'pending', createdAt: '', updatedAt: '' };
      req.params = { id: '1' };
      taskService.getTaskByIdService.mockResolvedValue(task);

      await taskController.getTaskById(req as Request, res as Response, next);

      expect(taskService.getTaskByIdService).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it('should call next with error on failure', async () => {
      req.params = { id: '1' };
      taskService.getTaskByIdService.mockRejectedValue(new Error('Error'));

      await taskController.getTaskById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateTask', () => {
    it('should update a task and return 200', async () => {
      const existingTask: Task = { id: '1', title: 'Old', description: '', status: 'pending', createdAt: '', updatedAt: '' };

      req.params = { id: '1' };
      req.body = { title: 'New' };
      taskService.getTaskByIdService.mockResolvedValue(existingTask);
      taskService.updateTaskService.mockResolvedValue();

      await taskController.updateTask(req as Request, res as Response, next);

      expect(taskService.getTaskByIdService).toHaveBeenCalledWith('1');
      expect(taskService.updateTaskService).toHaveBeenCalledWith(expect.objectContaining({ title: 'New' }));
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return 200', async () => {
      const task: Task = { id: '1', title: 'Test', description: '', status: 'pending', createdAt: '', updatedAt: '', fileUrl: 'http://example.com/file.txt' };
      req.params = { id: '1' };
      taskService.getTaskByIdService.mockResolvedValue(task);
      taskService.deleteTaskService.mockResolvedValue();
      fileUploadService.deleteFile.mockResolvedValue();

      await taskController.deleteTask(req as Request, res as Response, next);

      expect(taskService.getTaskByIdService).toHaveBeenCalledWith('1');
      expect(fileUploadService.deleteFile).toHaveBeenCalledWith('file.txt');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task Deleted successfully' });
    });
  });
});