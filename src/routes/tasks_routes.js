import { Router } from "express";
import tasksController from '../controllers/tasks_controller.js';
//import { authenticateToken } from "../middlewares/authenticate.middleware.js";

const router = Router();
/*
router.get('/', (req, res) => {
    res.send('Bienvenidos a tasks');
});

router.post('/', (req, res) => {
    res.send('Creando a tasks');
});
*/
/*router.route('/')
    .get(authenticateToken, tasksController.getTasks)
    .post(authenticateToken, tasksController.createTask);
*/
router.route('/')
    .get(tasksController.getTasks)
    .post(tasksController.createTask);
router.route('/:id')
    .get(tasksController.getTask)
    .put(tasksController.updateTask)
    .delete(tasksController.deleteTask)
    .patch(tasksController.taskDone);

export default router;