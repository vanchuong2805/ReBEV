// import userContacts from '../../repositories/userContactRepo.js';
// import wardService from '../address/wardService.js';

// const getUserContacts = async () => {
//     const data = await userContacts.findAll();
//     return data;
// };

// const getUserContact = async (id) => {
//     const data = await userContacts.findByPk(id);
//     return data;
// };

// const getUserContactsByUserId = async (userId) => {
//     const data = await userContacts.findAll({
//         where: {
//             user_id: userId,
//         },
//     });
//     return data;
// };

// const createUserContact = async ({ user_id, detail, ward_id, name, phone }) => {
//     const ward = await wardService.getWard(ward_id);
//     if (!ward) {
//         throw new Error('Ward not found');
//     }
//     const data = await userContacts.create({
//         user_id,
//         detail,
//         ward_id: ward.id,
//         name,
//         phone,
//     });
//     return data;
// }

// export default {
//     getUserContacts,
//     getUserContact,
//     getUserContactsByUserId,
//     createUserContact
// };
