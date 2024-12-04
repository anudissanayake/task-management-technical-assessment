import { dynamoDb } from '../../infrastructure/awsConfig';
import { Task } from '../../core/domain/entities/taskModel';
import { TaskRepository } from '../../core/domain/repositories/TaskRepository';


const tableName = process.env.DYNAMO_TABLE_NAME || 'Tasks';

export class DynamoDBTaskRepository implements TaskRepository {
  async create(task: Task): Promise<void> {
    await dynamoDb.put({ TableName: tableName, Item: task }).promise();
  }

  async findById(id: string): Promise<Task | null> {
    const result = await dynamoDb.get({ TableName: tableName, Key: { id } }).promise();
    return result.Item as Task | null;
  }

  async findAll(): Promise<Task[]> {
    const result = await dynamoDb.scan({ TableName: tableName }).promise();
    return result.Items as Task[];
  }

  async update(task: Task): Promise<void> {
    await dynamoDb.put({ TableName: tableName, Item: task }).promise();
  }

  async delete(id: string): Promise<void> {
    await dynamoDb.delete({ TableName: tableName, Key: { id } }).promise();
  }
}