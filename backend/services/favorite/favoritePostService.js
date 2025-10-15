import models from '../../models/index.js';
const { favorite_posts } = models;

const getAll = async () => {
    const data = await favorite_posts.findAll();
    return data;
}

const getByUserId = async (userId) => {
    const data = await favorite_posts.findAll({
        where: {
            user_id: userId
        }
    });
    return data;
}

const findFavoritePost = async ({
    user_id,
    post_id
}) => {
    const data = await favorite_posts.findOne({
        where: {
            user_id,
            post_id
        }
    });
    return data;
}

const createFavoritePost = async ({
    user_id,
    post_id
}) => {
    const data = await favorite_posts.create({
        user_id,
        post_id
    });
    return data;
}

const deleteFavoritePost = async ({
    post_id,
}) => {
    const data = await favorite_posts.destroy({
        where: {
            post_id: post_id
        }
    });
    return data;
}

export default {
    getAll,
    getByUserId,
    findFavoritePost,
    createFavoritePost,
    deleteFavoritePost
}