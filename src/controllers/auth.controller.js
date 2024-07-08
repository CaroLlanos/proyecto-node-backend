import logger from '../logs/logger.js';
import { User } from '../models/muser.js';
import { comparar } from '../common/bcrypt.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Status } from '../constants/index.js';

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: { username, status: Status.ACTIVE },
        });

        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });

        if (!(await comparar(password, user.password)))
            return res.status(403).json({ message: 'Usuario no autorizado' });
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: eval(process.env.JWT_EXPIRES_SECOND),
        });
        res.json({ token });

    } catch (error) {
        logger.error[error.mesage];
        res.status(500).json({
        message: error.mesage,
        });
    }
}

export default { login };