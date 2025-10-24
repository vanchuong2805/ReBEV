import models from '../../models/index.js';
const { posts, post_detail } = models;
const getAll = async () => {
    const data = await posts.findAll();
    return data;
};

const getById = async (id) => {
    const data = await posts.findByPk(id, {
        include: [{ model: post_detail, as: 'post_details' }],
    });
    return data;
};

const getByCategoryId = async (categoryId) => {
    const data = await posts.findAll({
        where: { category_id: categoryId },
    });
    return data;
};

const getByUserId = async (userId) => {
    const data = await posts.findAll({
        where: { user_id: userId },
    });
    return data;
};

const createPost = async (data, options) => {
    const post = await posts.create(data, options);
    return post;
};

const deletePost = async (postId) => {
    return await posts.update({ is_deleted: true }, { where: { id: postId } });
};

const updateStatus = async (postId, status, options = {}) => {
    return await posts.update({ status }, { where: { id: postId }, ...options });
};

const changeVisibility = async (postId, isHidden, options = {}) => {
    return await posts.update({ is_hidden: isHidden }, { where: { id: postId }, ...options });
};

export default {
    getAll,
    getByCategoryId,
    getByUserId,
    createPost,
    getById,
    deletePost,
    updateStatus,
    changeVisibility,
};
