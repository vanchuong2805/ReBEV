import postMedia from "../repositories/postMediaRepo";

const getAll =  async () => {
    return await postMedia.findAll();
}

const getById = async (id) => {
    return await postMedia.findByPk(id);
}

const getByPostId = async (postId) => {
    return await postMedia.findAll({ where: { post_id: postId } });
}

export default { getAll, getById, getByPostId };