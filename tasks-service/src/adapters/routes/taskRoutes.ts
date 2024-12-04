import { Router } from 'express';

import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { validateTask, validateUpdateTask } from '../../infrastructure/middlewares/validateTask';

const router = Router();

router.post('/', validateTask, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;
