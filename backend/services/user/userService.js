import models from '../../models/index.js';
const { users } = models;
// import bcrypt from 'bcrypt';
// import getRoleByName from './roleService.js';

// const getUsers = async () => {
//     const data = await users.findAll();
//     return data;
// };
// const getUser = async (id) => {
//     const data = await users.findByPk(id);
//     return data;
// };

// const getUsersByRole = async (roleId) => {
//     const data = await users.findAll({
//         where: {
//             role_id: roleId,
//         },
//     });
//     return data;
// };

// const getUserByEmail = async (emailUser) => {
//     const data = await users.findOne({
//         where: {
//             email: emailUser,
//         },
//     });
//     return data;
// };

// const getUserByPhone = async (phoneUser) => {
//     const data = await users.findOne({
//         where: {
//             phone: phoneUser,
//         },
//     });
//     return data;
// };

// const createUser = async ({ display_name, email, phone, password }) => {
//     const defaultRole = await getRoleByName('member');
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const data = await users.create({
//         display_name,
//         email,
//         phone,
//         password: hashedPassword,
//         role_id: defaultRole.id,
//     });
//     return data;
// };

export const getAll = async () => {
    const data = await users.findAll();
    return data;
}


// export default {
//     getUsers,
//     getUser,
//     getUsersByRole,
//     getUserByEmail,
//     getUserByPhone,
//     createUser
// };
