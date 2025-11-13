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

    const {
        user_id,
        category_id,
        status,
        search,
        variation_value_id,
        page,
        limit,
        iUser_id,
        province_id,
        order_by,
        order_direction,
        is_deleted,
        is_hidden,
        max_price,
        min_price,
    } = filters;
    let variationFilter = null;
    if (variation_value_id) {
        if (typeof variation_value_id === 'string') {
            variationFilter = [variation_value_id];
        } else {
            variationFilter = variation_value_id;
        }
    }

    const where = {};
    const include = province_id
        ? [
              {
                  association: 'seller_contact',
                  attributes: [],
              },
              {
                  association: 'base',
                  attributes: [],
              },
          ]
        : [];
    include.push({
        association: 'user',
        attributes: ['id', 'display_name', 'email', 'phone', 'avatar'],
        include: [
            {
                association: 'package',
                attributes: ['highlight', 'top'],
            },
        ],
    });
    if (variationFilter) {
        include.push({
            association: 'post_details',
            attributes: [],
        });
    }

    const order = [];

    order.push([Sequelize.literal('status'), 'ASC']);

    if (!order_by) {
        order.push([Sequelize.literal('[user->package].[top]'), 'DESC']);
    }
    let orderBy = order_by;
    let orderDirection = order_direction;
    if (!['price', 'create_at'].includes(orderBy)) {
        orderBy = 'create_at';
    }

    if (!['ASC', 'DESC'].includes(orderDirection)) {
        orderDirection = 'DESC';
    }

    order.push([Sequelize.literal(orderBy), orderDirection]);
    console.log(order);

    if (province_id) {
        where[Op.or] = [
            { '$base.province_id$': province_id },
            { '$seller_contact.province_id$': province_id },
        ];
    }

    if (is_deleted !== undefined) {
        where.is_deleted = is_deleted;
    }

    if (is_hidden !== undefined) {
        where.is_hidden = is_hidden;
    }

    if (min_price) {
        where.price = { ...(where.price || {}), [Op.gte]: min_price };
    }

    if (max_price) {
        where.price = { ...(where.price || {}), [Op.lte]: max_price };
    }

    if (iUser_id) {
        where.user_id = { [Op.ne]: iUser_id };
    }

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
            `(posts.title COLLATE SQL_Latin1_General_CP1_CI_AI LIKE ${escapedSearch} OR posts.description COLLATE SQL_Latin1_General_CP1_CI_AI LIKE ${escapedSearch})`
        );
    }
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || null;
    const offset = (pageNum - 1) * pageSize;

    const data = await posts.findAll({
        include,
        where,
        ...(pageSize ? { limit: pageSize, offset } : {}),
        order,
        attributes: [
            'id',
            'price',
            'title',
            'create_at',
            'status',
            'base_id',
            'seller_contact_id',
            'is_deleted',
            [Sequelize.literal('MAX(CAST(media AS NVARCHAR(MAX)))'), 'media'],
        ],
        group: [
            'posts.id',
            'posts.price',
            'posts.title',
            'posts.create_at',
            '[user->package].[top]',
            '[user->package].[highlight]',
            '[user->package].[id]',
            'posts.status',
            'posts.base_id',
            'posts.seller_contact_id',
            'user.id',
            'user.display_name',
            'user.email',
            'user.phone',
            'user.avatar',
            'posts.is_deleted',
        ],
        ...(variationFilter
            ? {
                  having: Sequelize.literal(
                      `COUNT(DISTINCT CASE WHEN post_details.variation_value_id IN (${variationFilter.join(
                          ','
                      )}) THEN post_details.variation_value_id END) = ${variationFilter.length}`
                  ),
              }
            : {}),
        subQuery: false,
    });

    const total = await posts.count({ include, where });

    return { data, pagination: pageSize ? { page: pageNum, limit: pageSize, total } : null };
};

const getById = async (id, options) => {
    const data = await posts.findByPk(id, {
        include: ['post_details'],
        ...options,
    });
    const review = await userReviewService.getByPostId(id);
    data.dataValues.review = review;
    return data;
};

const getCartItem = async (postId) => {
    const data = await posts.findOne({
        include: [
            {
                association: 'post_details',
                where: { variation_id: 13 }, // Assuming 13 is the variation_id for 'weight'
            },
            'category',
            'seller_contact',
        ],
        where: {
            id: postId,
            is_deleted: false,
            is_hidden: false,
            status: POST_STATUS.APPROVED,
        },
        attributes: ['id', 'user_id', 'title', 'price', 'media'],
    });

    const image =
        data && data.media
            ? JSON.parse(data.media).find((item) => item.is_thumbnail).url ||
              JSON.parse(data.media).url
            : null;

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

const updatePost = async (postId, data, options = {}) => {
    return await posts.update(data, { where: { id: postId }, ...options });
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
    updatePost,
};
