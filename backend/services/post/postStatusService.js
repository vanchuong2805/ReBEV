import postStatus from '../../repositories/postStatusRepo.js';

const getAll = async () => {
    return await postStatus.findAll();
};

const getById = async (id) => {
    return await postStatus.findByPk(id);
};

const getByPostId = async (postId) => {
    return await postStatus.findAll({ where: { post_id: postId } });
};

const getCurrent = async (postId) => {
    return await postStatus.findOne({
        where: { post_id: postId },
        order: [['create_at', 'DESC']],
    });
}

const create = async (data, transaction) => {
    return await postStatus.create(data, { transaction });
};



export default { getAll, getById, getByPostId, create, getCurrent };
