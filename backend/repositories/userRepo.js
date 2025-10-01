import initUser from '../models/users.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const users = initUser(sequelize, DataTypes);

export default users;
