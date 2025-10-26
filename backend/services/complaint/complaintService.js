import models from '../../models/index.js';

const { complaints } = models;

const getByOrderDetailId = async (orderDetailId) => {
    const data = await complaints.findOne({ where: { order_detail_id: orderDetailId } });
    return data;
};

export default {
    getByOrderDetailId,
};
