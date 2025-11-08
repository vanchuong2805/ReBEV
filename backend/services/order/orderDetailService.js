import models from '../../models/index.js';
const { order_detail } = models;

const getAll = async () => {
    const data = await order_detail.findAll();
    return data;
};

const getById = async (id) => {
    const data = await order_detail.findOne({ where: { id } });
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


const getRatingByPost = async (post_id) => {
    const data = await order_detail.findOne({
        include: [{
            association: "user_reviews",
            required: true,
        }],
        where: {
            post_id: post_id
        }
    })
    return data?.user_reviews;
}

const updateContractFile = async (id, contract_file, options) => {
    const result = await order_detail.update(
        { contract_file },
        { where: { id }, ...options }
    );
    return result;
};

const updateAppointmentTime = async (orderId, appointment_time, options) => {
    await order_detail.update(
        { appointment_time },
        { where: { order_id: orderId }, ...options }
    );
}

export default {
    getAll,
    createOrderDetails,
    createOrderDetail,
    getByOrderId,
    getByPostId,
    getRatingByPost,
    getById,
    getRatingByPost,
    updateContractFile,
    updateAppointmentTime,
};
