import serverlessExpress from '@vendia/serverless-express';
import app from './server';

// Create the serverless handler
export const handler = serverlessExpress({ app });
