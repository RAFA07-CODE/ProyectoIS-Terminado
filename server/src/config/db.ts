import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()

const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [__dirname + '/../models/**/*'],
    logging: false,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl:{
            require: true,
            rejectUnanuthorized: false
        }
    }
})

export default db