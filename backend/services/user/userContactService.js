import models from '../../models/index.js';
const { contacts } = models;

const getUserContacts = async () => {
    const data = await contacts.findAll();
    return data;
};

const getUserContact = async (id) => {
    console.log(contacts);
    const data = await contacts.findByPk(id);
    return data;
};

const getUserContactsByUserId = async (userId) => {
    const data = await contacts.findAll({
        where: {
            user_id: userId,
        },
    });
    return data;
};

const createUserContact = async ({ user_id,
    detail,
    ward_code,
    ward_name,
    district_id,
    district_name,
    province_id,
    province_name,
    name,
    phone
}) => {

    const data = await contacts.create({
        user_id,
        detail,
        ward_code,
        ward_name,
        district_id,
        district_name,
        province_id,
        province_name,
        name,
        phone
    });
    return data;
}

export default {
    getUserContacts,
    getUserContact,
    getUserContactsByUserId,
    createUserContact
};
