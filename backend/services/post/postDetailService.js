import postDetail from '../../repositories/postDetailRepo.js';

const getAll = async () => {
    return await postDetail.findAll();
};

const getById = async (id) => {
    return await postDetail.findByPk(id);
};

const getByPostId = async (postId) => {
    return await postDetail.findAll({ where: { post_id: postId } });
};

const create = async (data, transaction) => {
    return await postDetail.create(data, { transaction });
};

export default { getAll, getById, getByPostId, create };
