import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/users/{user_id}/lock-account:
 *   patch:
 *     summary: Khóa tài khoản người dùng
 *     description: Khóa tài khoản của người dùng dựa trên ID. Nếu tài khoản đã bị khóa trước đó, API sẽ trả về lỗi 400.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID của người dùng cần khóa
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Khóa tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account locked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     display_name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     phone:
 *                       type: string
 *                       example: "0901234567"
 *                     email:
 *                       type: string
 *                       example: "vana@example.com"
 *                     role:
 *                       type: integer
 *                       example: 0
 *                     balance:
 *                       type: string
 *                       example: "150000.00"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     package_id:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     is_locked:
 *                       type: boolean
 *                       example: true
 *                     package_start:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-01T07:00:00Z"
 *                     create_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-01T09:30:00Z"
 *                     update_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-30T09:00:00Z"
 *
 *       400:
 *         description: Tài khoản đã bị khóa trước đó hoặc yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account is already locked"
 *
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *
 *       500:
 *         description: Lỗi máy chủ nội bộ khi khóa tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to lock account"
 *                 error:
 *                   type: string
 *                   example: "Database connection timeout"
 */

const lockAccount = async (req, res) => {
    const { user_id } = req.params;
    try {

        const user = await userService.getUser(user_id);
        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND
            });
        }

        const isLocked = await userService.is_locked(user_id);
        if (isLocked) {
            return res.status(400).json({
                message: ERROR_MESSAGE.ACCOUNT_ALREADY_LOCKED
            });
        }

        const result = await userService.lockAccount(user_id);

        return res.status(200).json({
            message: SUCCESS_MESSAGE.ACCOUNT_LOCKED,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.ACCOUNT_LOCK_FAILED,
            error: error.message
        });
    }
};

export default lockAccount;
