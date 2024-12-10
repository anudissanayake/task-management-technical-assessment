import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

class DynamoDbSingleton {
  private static instance: DynamoDBDocumentClient;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  static getInstance(): DynamoDBDocumentClient {
    if (!DynamoDbSingleton.instance) {
      const dynamoDbClient = new DynamoDBClient({
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      DynamoDbSingleton.instance = DynamoDBDocumentClient.from(dynamoDbClient);
    }

    return DynamoDbSingleton.instance;
  }
}

// Export the Singleton instance
export const dynamoDb = DynamoDbSingleton.getInstance();
