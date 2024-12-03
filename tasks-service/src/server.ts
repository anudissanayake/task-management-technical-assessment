import express from 'express';
import taskRoutes from './adapters/routes/taskRoutes';
import errorHandler from './infrastructure/middlewares/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/tasks', taskRoutes);

app.use(errorHandler);  // Error handling middleware

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
