import users from '../repositories/userRepo.js';

const getUsers = async () => {
    const data = await users.findAll();
    return data;
};
const getUser = async (id) => {
    const data = await users.findByPk(id);
    return data;
};

const getUsersByRole = async (roleId) => {
    const data = await users.findAll({
        where: {
            role_id: roleId,
        },
    });
    return data;
};

export default { getUsers, getUser, getUsersByRole };
