import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/forget-password:
 *   post:
 *     summary: Đặt lại mật khẩu người dùng
 *     description: API cho phép người dùng đặt lại mật khẩu bằng số điện thoại đã đăng ký.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - newPassword
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Số điện thoại của người dùng
 *                 example: "0901234567"
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới của người dùng
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been reset successfully"
 *
 *       400:
 *         description: Dữ liệu yêu cầu không hợp lệ (thiếu thông tin hoặc sai định dạng)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Phone is required", "Password must be at least 8 characters"]
 *
 *       404:
 *         description: Không tìm thấy người dùng với số điện thoại được cung cấp
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
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

const forgetPassword = async (req, res) => {
    try {
        const {
            phone,
            newPassword
        } = req.body;

        const user = await userService.getUserByPhone(phone);

        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND,
            });
        }
        await userService.updatePassword(user.id, {
            password: newPassword
        });

        return res.status(200).json({
            message: SUCCESS_MESSAGE.PASSWORD_RESET_SUCCESS,
        });

    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.FORGET_PASSWORD_FAILED,
            error: error.message
        });
    }
}
export default forgetPassword;