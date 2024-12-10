import express from 'express';

import taskRoutes from './routes/TaskRoutes';
import userRoutes from './routes/UserRoutes';
import errorHandler from './infrastructure/middlewares/ErrorHandler';

const app = express();

app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);  // Error handling middleware

export default app;