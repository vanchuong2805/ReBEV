import complaintService from '../../services/complaint/complaintService.js';
import orderStatusService from '../../services/order/orderStatusService.js';

/**
 * @swagger
 * /api/users/{id}/complaints:
 *   get:
 *     summary: Get complaints by user ID
 *     description: Retrieve a list of complaints for a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve complaints for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of complaints for the specified user.
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 * */

const getByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        if (user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const complaints = await complaintService.getByUserId(id);
        for (let complaint of complaints) {
            const order_status = await orderStatusService.getByOrderId(complaint.return_order_id);
            complaint.dataValues.order_status = order_status;
            console.log(complaint);
        }
        res.status(200).json(complaints);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default getByUser;
