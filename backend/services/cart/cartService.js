import models from '../../models/index.js';
const { cart_items } = models;

const getCarts = async () => {
    const data = await cart_items.findAll();
    return data;
}

const getCartByPostId = async (postId) => {
    const data = await cart_items.findAll({
        where: {
            post_id: postId
        }
    });
    return data;
}

const getCartByUserId = async (userId) => {
    const data = await cart_items.findAll({
        where: {
            user_id: userId
        }
    });
    return data;
}

const findCartItem = async ({
    user_id,
    post_id
}) => {
    const data = await cart_items.findOne({
        where: {
            user_id,
            post_id
        }
    });
    return data;
}

const createCart = async ({
    user_id,
    post_id
}) => {
    const data = await cart_items.create({
        user_id,
        post_id
    });
    return data;
}

export default {
    getCarts,
    getCartByPostId,
    getCartByUserId,
    createCart,
    findCartItem
};