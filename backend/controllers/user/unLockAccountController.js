import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/users/{user_id}/unlock-account:
 *   patch:
 *     summary: Mở khóa tài khoản người dùng
 *     description: |
 *       API này cho phép **mở khóa tài khoản người dùng** dựa trên `user_id`.  
 *       - Nếu tài khoản chưa bị khóa, hệ thống trả về lỗi `400`.  
 *       - Nếu không tìm thấy người dùng, trả về `404`.  
 *       - Nếu thành công, hệ thống cập nhật trạng thái `is_locked = false` và trả về thông tin người dùng đã mở khóa.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID của người dùng cần mở khóa
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Mở khóa tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account unlocked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     display_name:
 *                       type: string
 *                       example: "Nguyen Van B"
 *                     phone:
 *                       type: string
 *                       example: "0909876543"
 *                     email:
 *                       type: string
 *                       example: "nguyenb@example.com"
 *                     is_locked:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Tài khoản đã được mở khóa trước đó
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account is already unlocked"
 *       404:
 *         description: Không tìm thấy người dùng cần mở khóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Lỗi máy chủ nội bộ khi mở khóa tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to unlock account"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

const unLockAccount = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await userService.getUser(user_id);

        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND
            });
        }

        const isLocked = await userService.is_locked(user_id);

        if (!isLocked) {
            return res.status(400).json({
                message: ERROR_MESSAGE.ACCOUNT_ALREADY_UNLOCKED
            });
        }

        const result = await userService.unLockAccount(user_id);

        return res.status(200).json({
            message: SUCCESS_MESSAGE.ACCOUNT_UNLOCKED,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.ACCOUNT_UNLOCK_FAILED,
            error: error.message
        });
    }
};

export default unLockAccount;