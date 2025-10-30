import { Sequelize } from 'sequelize';
import models from '../../models/index.js';
import order_status from '../../models/order_status.js';
import { ORDER_STATUS } from '../../config/constants.js';
const { user_reviews } = models;

const getByOrderDetailId = async (orderDetailId) => {
    const data = await user_reviews.findOne({
        where: {
            order_detail_id: orderDetailId
        }
    });
    return data;
};

export default {
    getByOrderDetailId,
};



