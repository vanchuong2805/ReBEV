import { SUCCESS_MESSAGE } from '../../config/constants.js';
import { ERROR_MESSAGE } from '../../config/constants.js';
import categoryService from '../../services/post/categoryService.js';

/**
 * @swagger
 * /api/categories/{id}/rate:
 *   put:
 *     summary: Cập nhật tỷ lệ deposit hoặc commission cho category
 *     tags: [Categories]
 *     description: API tự động kiểm tra `is_deposit` của category. Nếu is_deposit = 1 thì cập nhật `deposit_rate`, nếu is_deposit = 0 thì cập nhật `commission_rate`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của category cần cập nhật
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rate
 *             properties:
 *               rate:
 *                 type: number
 *                 format: float
 *                 example: 15
 *     responses:
 *       200:
 *         description: Cập nhật tỷ lệ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deposit rate updated"
 *                 categories:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Xe máy điện"
 *                     is_deposit:
 *                       type: integer
 *                       example: 1
 *                     deposit_rate:
 *                       type: integer
 *                       example: 15
 *                     commission_rate:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Category không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CATEGORY_NOT_FOUND"
 *       500:
 *         description: Lỗi máy chủ khi cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "UPDATE_CATEGORY_FAIL"
 */

const updateRateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rate } = req.body;

        const category = await categoryService.getById(id);
        if (!category) {
            return res.status(404).json({
                message: ERROR_MESSAGE.CATEGORY_NOT_FOUND
            });
        }

        const updatedRate = await categoryService.updateRate(id, rate);

        return res.status(200).json({
            message: SUCCESS_MESSAGE.CATEGORY_UPDATED_SUCCESSFULLY,
            categories: updatedRate
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export default updateRateById;