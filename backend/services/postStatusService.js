import postStatus from "../repositories/postStatusRepo";

const getAll =  async () => {
    return await postStatus.findAll();
}

const getById = async (id) => {
    return await postStatus.findByPk(id);
}

const getByPostId = async (postId) => {
    return await postStatus.findAll({ where: { post_id: postId } });
}

export default { getAll, getById, getByPostId };