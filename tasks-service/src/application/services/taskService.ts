// Encapsulate business logic and reusable functions(e.g., S3/DynamoDB interactions DynamoDB (e.g., creating, fetching, updating tasks).
import { Task } from '../../domain/models/taskModel';

const tasks: Task[] = [];  // In-memory array, replace with DB integration later

// export default {
//     createTaskService: (data: Partial<Task>) => {
//     const newTask: Task = { 
//       id: uuidv4(),
//       title: data.title || '',
//       description: data.description || '',
//       status: 'pending',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//     tasks.push(newTask);
//     return newTask;
//   },
  

//   getAllTasks: () => tasks,

//   // Implement methods for getTaskById, updateTask, deleteTask
// };

export const createTaskService = async (task: Task) => {

    // await dynamoDb.put({ TableName: tableName, Item: task }).promise();
    tasks.push(task);
    return tasks;
  };

export const getAllTasks =  () => {
    tasks;
};
