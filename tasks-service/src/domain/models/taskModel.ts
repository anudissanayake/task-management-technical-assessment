//task structure
// Provide provisioning instructions for creating the DynamoDB table (e.g., using AWS CLI, CloudFormation, or CDK).
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    updatedAt: Date;
  }
  