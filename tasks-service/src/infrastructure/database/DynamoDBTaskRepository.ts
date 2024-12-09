import { dynamoDb } from './DynamoDBConfig';
import { Task } from '../../core/domain/models/taskModel';
import { TaskRepository } from '../../core/repositories/TaskRepository';
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const tableName = process.env.DYNAMO_TASK_TABLE_NAME || 'Tasks';

export class DynamoDBTaskRepository implements TaskRepository {
  async create(task: Task): Promise<void> {
    const command = new PutCommand({
      TableName: tableName,
      Item: task,
    });
    await dynamoDb.send(command);
  }

  async findById(id: string): Promise<Task | null> {
    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    });
    const result = await dynamoDb.send(command);
    return result.Item as Task | null;
  }

  async findAll(): Promise<Task[]> {
    const command = new ScanCommand({
      TableName: tableName,
    });
    const result = await dynamoDb.send(command);
    return result.Items as Task[];
  }

  async update(task: Task): Promise<void> {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id: task.id },
      UpdateExpression: 'SET #title = :title, #description = :description, #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#description': 'description',
        '#status': 'status', // Added a placeholder for the reserved keyword
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':title': task.title,
        ':description': task.description,
        ':status': task.status,
        ':updatedAt': task.updatedAt,
      },
    });
    await dynamoDb.send(command);
  }

  async delete(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: { id },
    });
    await dynamoDb.send(command);
  }
}
