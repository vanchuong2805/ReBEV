import roles from '../../repositories/roleRepo.js';

const getRoles = async () => {
    const data = await roles.findAll();
    return data;
};

const getRole = async (id) => {
    const data = await roles.findByPk(id);
    return data;
};

export default { getRoles, getRole };
