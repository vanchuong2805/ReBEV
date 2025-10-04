import userContacts from '../../repositories/userContactRepo.js';

const getUserContacts = async () => {
    const data = await userContacts.findAll();
    return data;
};

const getUserContact = async (id) => {
    const data = await userContacts.findByPk(id);
    return data;
};

export default { getUserContacts, getUserContact };
