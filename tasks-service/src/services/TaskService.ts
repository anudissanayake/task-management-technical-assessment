import { Task } from '../core/domain/models/TaskModel';
import { DynamoDBTaskRepository } from '../infrastructure/database/DynamoDBTaskRepository';


export class TaskService {
  private taskRepository: DynamoDBTaskRepository;

  constructor(taskRepository: DynamoDBTaskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTaskService(task: Task): Promise<void> {
    await this.taskRepository.create(task);
  }

  async getTasksService(): Promise<Task[]> {
    return await this.taskRepository.findAll(); // Calls the repository method to retrieve all tasks
  }

  async getTaskByIdService(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id); // Calls the repository method to retrieve task by id
  }

  async updateTaskService(task: Task): Promise<void> {
    await this.taskRepository.update(task); // Calls the repository method to retrieve task by id
  }

  async deleteTaskService(id: string): Promise<void> {
    await this.taskRepository.delete(id); // Calls the repository method to retrieve task by id
  }

}