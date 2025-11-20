import complaintService from '../../services/complaint/complaintService.js';

/**
 * @swagger
 * /api/complaints:
 *   get:
 *     summary: Get all complaints
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of complaints
 *       500:
 *         description: Internal server error
 */

const getComplaints = async (req, res) => {
    try {
        const filters = req.query;
        const complaints = await complaintService.getAll(filters);
        res.status(200).json(complaints);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export default getComplaints;
