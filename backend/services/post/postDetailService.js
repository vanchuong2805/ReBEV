import models from '../../models/index.js';
const { post_detail } = models;
const getAll = async () => {
    const data = await post_detail.findAll();
    return data;
};

const getByPostId = async (postId) => {
    const data = await post_detail.findAll({
        where: { post_id: postId },
    });
    return data;
};

const createPostDetails = async (data, options) => {
    const postDetails = await post_detail.bulkCreate(data, options);
    return postDetails;
};

export default {
    getAll,
    getByPostId,
    createPostDetails,
};
