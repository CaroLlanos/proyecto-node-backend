import express from 'express';
import morgan from 'morgan';

const app = express();

//import routes
import usersRoutes from './routes/users_routes.js';
import tasksRoutes from './routes/tasks_routes.js';
import authRoutes from './routes/auth_routes.js';
import { authenticateToken } from './middlewares/authenticate.middleware.js';

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api/tasks', authenticateToken, tasksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/login', authRoutes);

export default app;