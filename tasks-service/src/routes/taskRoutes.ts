import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { FileUploadService } from '../services/FileUploadService';
import { DynamoDBTaskRepository } from '../infrastructure/database/DynamoDBTaskRepository';
// import { validateTask, validateUpdateTask } from '../infrastructure/middlewares/validateTask';
const taskRepository = new DynamoDBTaskRepository();
const taskService = new TaskService(taskRepository);
const fileUploadService = new FileUploadService();
const taskController = new TaskController(taskService, fileUploadService);

const taskRoutes = Router();

taskRoutes.post('/', taskController.createTask);
// router.get('/tasks', taskController.getTasks);
// router.get('/tasks/:id', taskController.getTaskById);
// router.put('/tasks/:id', taskController.updateTask);
// router.delete('/tasks/:id', taskController.deleteTask);
export default taskRoutes;
