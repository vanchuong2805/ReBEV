import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    port: process.env.DB_PORT,
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
    logging: true,
    define: {
        timestamps: false,
        freezeTableName: true,
    },
});

export default sequelize;
