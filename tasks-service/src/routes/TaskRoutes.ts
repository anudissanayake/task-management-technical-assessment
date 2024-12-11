import { Router } from 'express';
import multer from 'multer';

import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { FileUploadService } from '../services/FileUploadService';
import { DynamoDBTaskRepository } from '../infrastructure/database/DynamoDBTaskRepository';
import { validateTask, validateUpdateTask } from '../infrastructure/middlewares/ValidateTask'
const taskRepository = new DynamoDBTaskRepository();
const taskService = new TaskService(taskRepository);
const fileUploadService = new FileUploadService();
const taskController = new TaskController(taskService, fileUploadService);

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const taskRoutes = Router();

taskRoutes.post('/', upload.single('file'), validateTask, taskController.createTask);
taskRoutes.get('/', taskController.getTasks);
taskRoutes.get('/:id', taskController.getTaskById);
taskRoutes.put('/:id', upload.single('file'), validateUpdateTask, taskController.updateTask);
taskRoutes.delete('/:id', taskController.deleteTask);
export default taskRoutes;
