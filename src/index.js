import app from './app.js';
import 'dotenv/config';
import logger from './logs/logger.js'
import { sequelize } from './database/database.js';

async function main() {
    //iniciar sequelize
    await sequelize.sync({ force: false });

    const port = process.env.PORT
    app.listen(port);
    logger.info(`Listening to port ${port}`);
}

main();