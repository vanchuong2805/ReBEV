import models from '../../models/index.js';
import { Op, Sequelize, where } from 'sequelize';
import { sequelize } from '../../models/index.js';
import { POST_STATUS } from '../../config/constants.js';
import { raw } from 'express';
import userReviewService from '../user/userReviewService.js';
const { posts } = models;
const getPosts = async (filters = {}) => {
    // Use query to filter user, part of title / description, variation values, category, status,...
    // split page and limit for pagination
    /*
    Example filters:
    {
        user_id: 1,
        category_id: 2,
        status: 1,
        search: 'some text',
        variation_value_ids: [1, 2, 3],
        page: 1,
        limit: 10,
    }
    */

    const { user_id, category_id, status, search, variation_value_ids, page, limit } = filters;

    const where = { is_deleted: false, is_hidden: false };

    if (user_id) {
        where.user_id = user_id;
    }

    if (category_id) {
        where.category_id = category_id;
    }

    if (status) {
        where.status = status;
    }

    if (search) {
        const escapedSearch = sequelize.escape(`%${search}%`);
        console.log(escapedSearch);
        // normal text search in title and description
        where[Op.and] = sequelize.literal(
            `(title COLLATE SQL_Latin1_General_CP1_CI_AI LIKE ${escapedSearch} OR description COLLATE SQL_Latin1_General_CP1_CI_AI LIKE ${escapedSearch})`
        );
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || null;
    const offset = (pageNum - 1) * pageSize;

    const data = await posts.findAll({
        where,
        ...(pageSize ? { limit: pageSize, offset } : {}),
    });

    const total = await posts.count({ where });

    return { data, pagination: pageSize ? { page: pageNum, limit: pageSize, total } : null };
};

const getById = async (id, options) => {
    const data = await posts.findByPk(id, {
        include: ['post_details'],
        ...options,
    });
    const review = await userReviewService.getByPostId(id);
    data.review = review;
    return data;
};

const getCartItem = async (postId) => {
    const data = await posts.findOne({
        include: [{
            association: 'post_details',
            where: { variation_id: 13 }, // Assuming 13 is the variation_id for 'weight'
        }, 'category', 'seller_contact'],
        where: {
            id: postId,
            is_deleted: false,
            is_hidden: false,
            status: POST_STATUS.APPROVED,
        },
        attributes: ['id', 'user_id', 'title', 'price', "media"],
    });

    const image = data && data.media ? (JSON.parse(data.media).find(item => item.is_thumbnail).url || JSON.parse(data.media).url) : null;

    if (data) data.media = image;

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
        where: { user_id: userId, is_deleted: false },
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

const updateStatus = async (postId, data, options = {}) => {
    return await posts.update(data, { where: { id: postId }, ...options });
};

const changeVisibility = async (postId, isHidden, options = {}) => {
    return await posts.update({ is_hidden: isHidden }, { where: { id: postId }, ...options });
};

export default {
    getPosts,
    getByCategoryId,
    getByUserId,
    createPost,
    getById,
    deletePost,
    updateStatus,
    changeVisibility,
    getCartItem,
};

