import { ORDER_STATUS } from '../../config/constants.js';
import models from '../../models/index.js';
import orderStatusService from './orderStatusService.js';
const { order_detail } = models;

const getAll = async () => {
    const data = await order_detail.findAll();
    return data;
};

const getByOrderId = async (orderId) => {
    const data = await order_detail.findAll({ where: { order_id: orderId } });
    return data;
};

const createOrderDetails = async (data, options) => {
    const orderDetails = await order_detail.bulkCreate(data, options);
    return orderDetails;
};

const createOrderDetail = async (data, options) => {
    const orderDetail = await order_detail.create(data, options);
    return orderDetail;
};

const getByPostId = async (postId) => {
    const data = await order_detail.findAll({ where: { post_id: postId } });
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

    // const latestStatus = await order_status.findOne({
    //     where: {
    //         order_id: orderDetail.order_id
    //     },
    //     order: [['created_at', 'DESC']],
    // });

    const latestStatus = await orderStatusService.getLatestStatus(orderDetail.order_id);

    if (!latestStatus || latestStatus.status !== ORDER_STATUS.COMPLETED) {
        throw new Error('Cannot review an order that is not completed');
    }
    const reviewExists = await user_reviews.findOne({
        where: {
            user_id: user_id,
            id: order_detail_id
        }
    });

    if (reviewExists) {
        throw new Error('Review already exists for this order detail');
    }

    const data = await user_reviews.create({
        user_id: user_id,
        order_detail_id: order_detail_id,
        rating: rating,
        comment: comment,
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

    if(!review) {
        throw new Error
    }

    const data = await user_reviews.update({
        rating,
        comment,
        update_at: Sequelize.literal('GETDATE()')
    }, {
        where: {
            id: reviewId
        }
    });

    return data;
};

export default {
    getAll,
    createOrderDetails,
    createOrderDetail,
    getByOrderId,
    getByPostId,
    createReview,
    updateReview
};
