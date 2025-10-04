import postMedia from '../../repositories/postMediaRepo.js';

const getAll = async () => {
    return await postMedia.findAll();
};

const getById = async (id) => {
    return await postMedia.findByPk(id);
};

const getByPostId = async (postId) => {
    return await postMedia.findAll({ where: { post_id: postId } });
};

const create = async (data, transaction) => {
    return await postMedia.create(data, { transaction });
};

export default { getAll, getById, getByPostId, create };
