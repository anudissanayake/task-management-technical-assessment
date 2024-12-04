import { Task } from '../domain/entities/taskModel';
import { TaskRepository } from '../domain/repositories/TaskRepository';

export class createTaskService {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: Task): Promise<void> {
    await this.taskRepository.create(task);
  }
}