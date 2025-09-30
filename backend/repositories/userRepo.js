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
const getUserByID = async (id) => {
    const data = await users.findByPk(id);
    return data;
};

const getUsersByRole = async (r_id) => {
    const data = await users.findAll({
        where: {
            role_id: r_id,
        },
    });
    return data;
};

// -----------------ROLE--------------------------

const getAllRoles = async () => {
    const data = await roles.findAll();
    return data;
};

const getRoleByID = async (id) => {
    const data = await roles.findByPk(id);
    return data;
};

export default { getAllUsers, getUserByID, getAllRoles, getRoleByID, getUsersByRole };
