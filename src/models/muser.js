import { sequelize } from '../database/database.js';
import { Status } from '../constants/index.js';
import { Task } from './mtask.js';
import { DataTypes } from 'sequelize';
import { encriptar } from '../common/bcrypt.js';

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Ingrese nombre de usuario',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese contrasena',
            },
        },
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `Debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`,
            },
        },
    },
});

//Forma Automatica
//Un usuario tiene muchas tareas
User.hasMany(Task)
//Pero una tarea tiene un solo usuario
Task.belongsTo(User)

//Forma Manual
//Un usuario tiene muchas tareas
/*User.hasMany(Task, {
    foreignKey: 'user_id',
    sourceKey: 'id'
    }
)
//Pero una tarea tiene un solo usuario
Task.belongsTo(USer, {
    foreignKey: 'user_id',
    targetKey: 'id'
}) */

User.beforeCreate(async (user) => {
    try {
        user.password = await encriptar(user.password)
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar la contrasena');
    }
})

User.beforeUpdate(async (user) => {
    try {
        user.password = await encriptar(user.password)
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar la contrasena');
    }
})