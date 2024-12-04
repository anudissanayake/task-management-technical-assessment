import { Task } from '../domain/entities/taskModel';
import { TaskRepository } from '../domain/repositories/TaskRepository';

export class createTaskService {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: Task): Promise<void> {
    await this.taskRepository.create(task);
  }
}

export class getTaskService {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.findAll(); // Calls the repository method to retrieve all tasks
  }
}

export class getTaskByIdService {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id); // Calls the repository method to retrieve task by id
  }

}

export class updateTaskService {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: Task): Promise<void> {
    await this.taskRepository.update(task); // Calls the repository method to retrieve task by id
  }

}

export class deleteTaskService {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    await this.taskRepository.delete(id); // Calls the repository method to retrieve task by id
  }

}