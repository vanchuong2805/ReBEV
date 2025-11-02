import { Sequelize } from 'sequelize';
import models from '../../models/index.js';
import { ORDER_STATUS } from '../../config/constants.js';
const { user_reviews, order_detail } = models;
import orderStatusService from '../order/orderStatusService.js';
import { raw } from 'express';

const getAll = async () => {
    const data = await user_reviews.findAll();
    return data;
}

const getReview = async (reviewId) => {
    const data = await user_reviews.findOne({
        where: {
            id: reviewId
        }
    });
    return data;
}

const getByPostId = async (postId) => {
    const data = await user_reviews.findOne({
        include: [{
            association: 'order_detail',
            where: {
                post_id: postId
            },
            attributes: []
        }, {
            association: 'user',
            attributes: ['display_name', 'avatar']
        }],
        raw: true
    });
    return data;
}

const getByOrderDetailId = async (orderDetailId) => {
    const data = await user_reviews.findOne({
        where: {
            order_detail_id: orderDetailId
        }
    });
    return data;
};

const createReview = async ({
    user_id,
    order_detail_id,
    rating,
    comment
}) => {
    const orderDetail = await order_detail.findOne({
        where: {
            id: order_detail_id
        }
    });

    if (!orderDetail) {
        throw new Error('Order detail not found');
    }

    const latestStatus = await orderStatusService.getCurrentStatus(orderDetail.order_id);

    if (!latestStatus || latestStatus.status !== ORDER_STATUS.COMPLETED) {
        throw new Error('Cannot review an order that is not completed');
    }
    const reviewExists = await user_reviews.findOne({
        where: {
            user_id,
            order_detail_id
        }
    });

    if (reviewExists) {
        throw new Error('Review already exists for this order detail');
    }

    const data = await user_reviews.create({
        user_id,
        order_detail_id,
        rating_value: rating,
        comment
    });

    return data;
};

const updateReview = async (reviewId, {
    rating,
    comment
}) => {

    const review = await user_reviews.findOne({
        where: {
            id: reviewId
        }
    });

    if (!review) {
        throw new Error('Review not found');
    }

    const createAt = new Date(review.create_at);

    const expDate = new Date(createAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (expDate > Date.now()) {

        const data = await user_reviews.update({
            rating_value: rating,
            comment,
            update_at: Sequelize.literal('GETDATE()')
        }, {
            where: {
                id: reviewId
            }
        });

        return data;
    }

    else throw new Error('Review update period has expired');
};

const deleteReview = async (reviewId) => {
    const review = await user_reviews.findOne({
        where: {
            id: reviewId
        }
    });

    if (!review) {
        throw new Error('Review not found');
    }

    const data = await user_reviews.destroy({
        where: {
            id: reviewId
        }
    });

    return data;
};

export default {
    getAll,
    getReview,
    getByOrderDetailId,
    createReview,
    updateReview,
    deleteReview,
    getByPostId
};



