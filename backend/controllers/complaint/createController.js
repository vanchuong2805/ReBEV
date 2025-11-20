import {
    COMPLAINT_STATUS,
    COMPLAINT_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
} from '../../config/constants.js';
import complaintService from '../../services/complaint/complaintService.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import orderService from '../../services/order/orderService.js';
import orderStatusService from '../../services/order/orderStatusService.js';

/**
 * @swagger
 * api/complaints:
 *   post:
 *     tags: [Complaints]
 *     summary: Create a complaint
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             order_detail_id:
 *               type: integer
 *               example: 1
 *             complaint_type:
 *               type: string
 *               enum: [PRODUCT, SERVICE]
 *               example: PRODUCT
 *             description:
 *               type: string
 *               example: "The product is defective."
 *             media:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uri
 *               example: [{url: "image http://example.com/image1.jpg"}, {url: "image http://example.com/image2.jpg"}]
 */

const createComplaint = async (req, res) => {
    try {
        const { user } = req;
        const { order_detail_id, complaint_type, description, media } = req.body;
        if (
            !order_detail_id ||
            complaint_type === undefined ||
            !description ||
            description.trim() === '' ||
            !media
        ) {
            console.log({ order_detail_id, complaint_type, description, media });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!Object.values(COMPLAINT_TYPE).includes(complaint_type)) {
            return res.status(400).json({ error: 'Invalid complaint type' });
        }

        const orderDetail = await orderDetailService.getById(order_detail_id);
        if (!orderDetail) {
            return res.status(404).json({ error: 'Order detail not found' });
        }

        const existingComplaint = await complaintService.getByOrderDetailId(order_detail_id);

        if (existingComplaint) {
            return res
                .status(400)
                .json({ error: 'Complaint for this order detail already exists' });
        }

        const order = await orderService.getById(orderDetail.order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.customer_id !== user.id || order.order_type === ORDER_TYPE.DEPOSIT) {
            return res
                .status(403)
                .json({ error: 'Unauthorized to file complaint for this order detail' });
        }

        const currentStatus = await orderStatusService.getCurrentStatus(order.id);
        if (!currentStatus) {
            return res.status(404).json({ error: 'Order status not found' });
        }
        if (currentStatus.status !== ORDER_STATUS.DELIVERED) {
            return res.status(400).json({ error: 'Order is not completed' });
        }

        console.log({
            order_detail_id,
            complaint_type,
            description,
            media: JSON.stringify(media),
            user_id: user.id,
        });

        const complaint = await complaintService.createComplaint({
            order_detail_id,
            conplaint_type: complaint_type,
            description,
            media: JSON.stringify(media),
            user_id: user.id,
            complaint_status: COMPLAINT_STATUS.PENDING,
        });

        return res.status(201).json({ message: 'Complaint created successfully', complaint });
    } catch (error) {
        console.log(error);
    }
};
export default createComplaint;
