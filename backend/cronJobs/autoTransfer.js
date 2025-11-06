import nodeCron from 'node-cron';

import { sequelize } from '../models/index.js';
import orderService from '../services/order/orderService.js';
import orderStatusService from '../services/order/orderStatusService.js';
import { ORDER_STATUS } from '../config/constants.js';
import { handleCompletedStatus } from '../services/order/orderStatusService.js';

const autoTransferOrderStatus = nodeCron.schedule(process.env.CRON_ORDER_SCHEDULE, async () => {
    const orders = await orderService.getOrdersDelivered();
    for (const order of orders) {
        const t = await sequelize.transaction();
        try {
            await orderStatusService.updateOrderStatus(
                { order_id: order.id, status: ORDER_STATUS.COMPLETED },
                { transaction: t }
            );
            await handleCompletedStatus(order, t);
            await t.commit();
        } catch (error) {
            await t.rollback();
            console.log(error);
        }
    }
});

export default autoTransferOrderStatus;
