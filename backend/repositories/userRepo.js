import initUser from '../models/users.js';
import initRole from '../models/roles.js';
import sequelize from '../config/db.js';
import { DataTypes, where } from 'sequelize';
const users = initUser(sequelize, DataTypes);
const roles = initRole(sequelize, DataTypes);

// -----------------USER--------------------------

const getAllUsers = async () => {
    const data = await users.findAll();
    return data;
};

// -----------------ROLE--------------------------





export default {getAllUsers}