import models from '../../models/index.js';
const { contacts } = models;
const { users } = models;

const getUserContacts = async (options) => {
    const data = await contacts.findAll({
        where: {
            ...options,
            is_deleted: false
        },
    });
    return data;
};

const getUserContact = async (id) => {
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

const getUserById = async (id) => {
    const data = await users.findByPk(id);
    return data;
}

const createUserContact = async ({
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

const updateUserContact = async ({
    id,
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
}) => {
    const data = await contacts.update({
        detail,
        ward_code,
        ward_name,
        district_id,
        district_name,
        province_id,
        province_name,
        name,
        phone
    }, {
        where: {
            id: id,
            user_id: user_id
        }
    });
    return data;
}

const deleteUserContact = async ({
    id
}) => {
    const data = await contacts.update({
        is_deleted: true
    }, {
        where: {
            id: id
        }
    });
    const updatedContact = await contacts.findOne({
        where: {
            id: id
        }
    })
    return updatedContact;
}

export default {
    getUserContacts,
    getUserContact,
    getUserContactsByUserId,
    createUserContact,
    updateUserContact,
    getUserById,
    deleteUserContact
};
