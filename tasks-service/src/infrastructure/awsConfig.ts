import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION,
});

export const s3 = new AWS.S3();
export const dynamoDb = new AWS.DynamoDB.DocumentClient();