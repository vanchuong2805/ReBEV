import transactionService from '../../services/transaction/transactionService.js';
import {
    POST_STATUS,
    ORDER_TYPE,
    TRANSACTION_TYPE,
    TRANSACTION_STATUS,
    ORDER_STATUS,
} from '../../config/constants.js';
import orderStatusService from '../../services/order/orderStatusService.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import postService from '../../services/post/postService.js';

const createOrderTransaction = async (req, res) => {
    console.log('Receive momo request');
    try {
        const { resultCode, extraData } = req.body;

        const ordersList = JSON.parse(extraData);
        console.log(ordersList);
        for (const order of ordersList) {
            const transactionData = {
                sender_id: order.customer_id,
                receiver_id: order.seller_id,
                transaction_type:
                    order.order_type === ORDER_TYPE.BUY
                        ? TRANSACTION_TYPE.BUY
                        : TRANSACTION_TYPE.DEPOSIT,
                related_order_id: order.id,
                amount: order.total_amount,
                status: resultCode,
            };
            console.log('Creating transaction:', transactionData);
            // Create transaction

            await transactionService.createTransaction(transactionData);
            // Update order status based on transaction result
            const orderDetails = await orderDetailService.getByOrderId(order.id);
            if (resultCode !== TRANSACTION_STATUS.SUCCESS) {
                await orderStatusService.updateOrderStatus({
                    order_id: order.id,
                    status: ORDER_STATUS.FAIL_PAY,
                });
                for (const item of orderDetails) {
                    await postService.updateStatus(item.post_id, POST_STATUS.APPROVED);
                }
            } else {
                await orderStatusService.updateOrderStatus({
                    order_id: order.id,
                    status: ORDER_STATUS.PAID,
                });
            }
        }

        res.status(201).json({ message: 'Transaction created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
export default createOrderTransaction;
