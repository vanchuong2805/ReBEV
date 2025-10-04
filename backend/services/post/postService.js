import post from '../../repositories/postRepo.js';

const getAll = async () => {
    return await post.findAll();
};

const getById = async (id) => {
    return await post.findByPk(id);
};

const getByUserId = async (userId) => {
    return await post.findAll({ where: { user_id: userId } });
};

const create = async (data, transaction) => {
    return await post.create(data, { transaction });
};

export default { getAll, getById, getByUserId, create };
