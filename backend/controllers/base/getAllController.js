import baseService from '../../services/address/baseService.js';

/**
 * @swagger
 * /api/bases:
 *   get:
 *     summary: Lấy danh sách các base
 *     tags: [Bases]
 *     responses:
 *       200:
 *         description: Danh sách các base
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Base'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

const getAllBases = async (req, res) => {
    try {
        const bases = await baseService.getAll();
        res.status(200).json(bases);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default getAllBases;