import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDb } from './DynamoDBConfig';
const tableName =process.env.DYNAMO_USER_TABLE_NAME || 'UserCache';

export const getFromCache = async (key: string): Promise<unknown> => {
  try {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        "cacheKey": { S: key },
      },
    });

    const result = await dynamoDb.send(command);
    return result.Item ? result.Item : [];

  } catch (error) {
    console.error("Error fetching from cache:", error);
    throw error;
  }
};


// Put data into DynamoDB cache
export const putInCache = async (key: string, data: unknown): Promise<void> => {
    try {
      const command = new PutItemCommand({
        TableName: tableName,
        Item: {
          "cacheKey": { S: key }, // The key of the item
          "data": { S: JSON.stringify(data) }, // Assuming data is a JSON serializable object
          // Optionally, you can add a TTL (Time-To-Live) field for cache expiration
          // "ttl": { N: (Date.now() + 3600 * 1000).toString() }, // TTL 1 hour
        },
      });
  
      await dynamoDb.send(command); // Send the PutItem command to DynamoDB
  
      console.log(`Data successfully cached with key: ${key}`);
    } catch (error) {
      console.error("Error putting data into cache:", error);
      throw error;
    }
  };