import express from 'express';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import errorHandler from './infrastructure/middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);  // Error handling middleware

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
