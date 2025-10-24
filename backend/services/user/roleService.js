import models from '../../models/index.js';
const { roles } = models;

const getRoles = async () => {
    const data = await roles.findAll();
    return data;
};

const getRole = async (id) => {
    const data = await roles.findByPk(id);
    return data;
};

const getRoleByName = async (roleName) => {
    const data = await roles.findOne({
        where: {
            name: roleName,
        },
    });
    return data;
};

export default {
    getRoles,
    getRole,
    getRoleByName
};
