import initRole from '../models/roles.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const roles = initRole(sequelize, DataTypes);

export default roles;
