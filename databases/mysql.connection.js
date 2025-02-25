import * as mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// const sequelize = new Sequelize(process.env.SQL_BBDD, process.env.SQL_USER, process.env.SQL_PASS, {
//     host: process.env.SQL_HOST,
//     dialect: 'mysql',
// });

// export { sequelize };

export async function mysqlconnection() {
    const sequelize = new Sequelize(process.env.SQL_BBDD, process.env.SQL_USER, process.env.SQL_PASS, {
        host: process.env.SQL_HOST,
        dialect: 'mysql',
    });

    return sequelize;
}