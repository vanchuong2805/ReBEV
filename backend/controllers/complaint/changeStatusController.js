import { sequelize } from '../../models/index.js';
import complaintService from '../../services/complaint/complaintService.js';

/**
 * @swagger
 * api/complaints/{id}/status:
 *   put:
 *     summary: Update complaint status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Complaint ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, REJECTED, RESOLVED, CANCELLED]
 *     responses:
 *       200:
 *         description: Complaint status updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Complaint not found
 *       403:
 *         description: Unauthorized to change status of this complaint
 *       500:
 *         description: Internal server error
 */

const changeStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const complaint = await complaintService.getById(id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        await complaintService.updateStatus(id, status, { transaction: t });
        await complaintService.handleStatus(complaint.id, complaint.order_detail_id, status, t);
        await t.commit();
        return res.status(200).json({ message: 'Complaint status updated successfully' });
    } catch (error) {
        console.log(error);
        if (t) await t.rollback();
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default changeStatus;
