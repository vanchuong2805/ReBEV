import transactionService from '../../services/transaction/transactionService.js';
import { ORDER_STATUS, TRANSACTION_STATUS, POST_STATUS } from '../../config/constants.js';
import orderStatusService from '../../services/order/orderStatusService.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import postService from '../../services/post/postService.js';

const createOrderTransaction = async (req, res) => {
    console.log("Receive momo request");
    try {
        const { orderId, amount, resultCode, extraData } = req.body;

        const { sender_id, receiver_id, transaction_type } = JSON.parse(extraData);
        const order_id = orderId.split('_')[0];
        // Create transaction
        const transactionData = {
            sender_id,
            receiver_id,
            transaction_type,
            related_order_id: order_id,
            amount,
            status: resultCode,
        };
        const transaction = await transactionService.createTransaction(transactionData);
        const orderDetails = await orderDetailService.getByOrderId(order_id);
        if (resultCode !== TRANSACTION_STATUS.SUCCESS) {
            await orderStatusService.updateOrderStatus({ order_id, status: ORDER_STATUS.FAIL_PAY });
            for (const item of orderDetails) {
                await postService.updateStatus(item.post_id, POST_STATUS.APPROVED);
            }
        } else {
            await orderStatusService.updateOrderStatus({ order_id, status: ORDER_STATUS.PAID });
        }
        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
export default createOrderTransaction;
