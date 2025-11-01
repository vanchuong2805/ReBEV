import models from '../../models/index.js';

const { complaints } = models;

const getByOrderDetailId = async (orderDetailId) => {
    const data = await complaints.findOne({ where: { order_detail_id: orderDetailId } });
    return data;
};

const createComplaint = async (data, options = {}) => {
    const complaint = await complaints.create(data, options);
    return complaint;
}

export default {
    getByOrderDetailId,
};
