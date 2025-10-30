import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/get-otp:
 *   post:
 *     summary: Yêu cầu mã OTP để đặt lại mật khẩu
 *     description: API cho phép người dùng yêu cầu một mã OTP (One-Time Password) để đặt lại mật khẩu thông qua số điện thoại đã đăng ký.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Số điện thoại của người dùng
 *                 example: "0901234567"
 *     responses:
 *       200:
 *         description: Gửi mã OTP thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP has been sent successfully"
 *                 otp:
 *                   type: string
 *                   example: "483920"
 *
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ (thiếu hoặc sai định dạng số điện thoại)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid phone number format"
 *
 *       404:
 *         description: Không tìm thấy người dùng với số điện thoại đã cung cấp
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


const getOTPPassword = async (req, res) => {

    try {
        const { phone } = req.body;

        const user = await userService.getUserByPhone(phone);

        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND,
            });
        }
        const randomotp = Math.floor(100000 + Math.random() * 900000).toString();
        return res.status(200).json({
            message: SUCCESS_MESSAGE.OTP_SENT,
            otp: randomotp
        });

    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.FORGET_PASSWORD_FAILED,
            error: error.message
        });
    }

}

export default getOTPPassword;
