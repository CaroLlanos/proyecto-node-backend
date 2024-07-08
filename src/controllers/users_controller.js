import { User } from '../models/muser.js';
import { Task } from '../models/mtask.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [['id', 'DESC']],
            where: {
                status: Status.ACTIVE
            }
        })
        res.json(users);
    } catch (error) {
        logger.error[error.mesage];
        res.status(500).json({
        message: error.mesage,
        });
    }
}

async function createUser(req, res) {
    //forma mas larga:
    //const body = req.body;
    //const username = body.username;
    //const password = body.password;
    //console.log(username, password);
    //res.send(body);

    //forma mas corta:
    const { username, password } = req.body;
    //console.log(username, password);
    //res.send(body)

    try {
        logger.info('[userController] createUser: ' + username);
        const user = await User.create({
            username: username,
            password: password,
        });
        return res.json(User);
    } catch (error) {
        logger.error[error.mesage];
        res.status(500).json({
            message: error.mesage,
        });
    }
}

async function getUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username', 'status'],
            where: { id },
        });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user)

    } catch (error) {
        logger.error[error.mesage];
        res.status(500).json({
            message: error.mesage,
        });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        if (!username || !password)
            return res.status(400).json({ message: 'falta username o password' });
        
        const user = await User.update({
            username,
            password,
        },
            {
                where: { id },
            });

        res.json(user);

    } catch (error) {
        logger.error[error.mesage];
        res.status(500).json({
            message: error.mesage,
        });
    }
}

const activeInactive = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!status) 
            return res.status(400).json({ message: 'No existe el status' });
        
        const user = await User.findByPk(id);
        if (user.status === status) {
            return res.status(400).json({
                message: `El usuario ya se encuentra ${status}`
            });
        }
        user.status = status;
        await user.save();
        res.json(user);

    } catch (error) {
        logger.error(error.mesage);
        res.status(500).json({
            message: error.mesage,
        });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.destroy({ where: { userId: id } });
        await User.destroy({ where: { id } });
        return res.sendStatus(204);
    } catch (error) {
        logger.error[error.mesage];
        res.status(500).json({
            message: error.mesage,
        });
    }
}

async function getTasks(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'], 
            where: { id },
            include: [
                {
                    model: Task,
                    attributes : ['name', 'done'],
                }
            ]
        })
    res.json(user);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ 
            message: error.message
        });
    }
}

export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    activeInactive,
    deleteUser,
    getTasks
};