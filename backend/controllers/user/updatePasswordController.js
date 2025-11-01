import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";


/**
 * @swagger
 * /api/users/{id}/update-password:
 *   put:
 *     summary: Cập nhật mật khẩu người dùng
 *     description: API cho phép người dùng thay đổi mật khẩu của chính họ. Yêu cầu xác thực và kiểm tra mật khẩu cũ trước khi đặt mật khẩu mới.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng muốn cập nhật mật khẩu
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu hiện tại của người dùng
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới cần cập nhật
 *                 example: "NewPassword456!"
 *     responses:
 *       200:
 *         description: Cập nhật mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin người dùng thành công"
 *       400:
 *         description: Mật khẩu cũ không đúng hoặc dữ liệu đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Password Incorrect"
 *       403:
 *         description: Người dùng không có quyền thay đổi mật khẩu của người khác
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: Không tìm thấy người dùng hoặc mật khẩu mới bị bỏ trống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Password cannot be blank"
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi cập nhật mật khẩu người dùng"
 */

const updatePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if (parseInt(id) !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { oldPassword, newPassword } = req.body;

        const isPasswordCorrect = await userService.checkPassword(id, {
            password: oldPassword
        });

        if (!isPasswordCorrect) {
            return res.status(400).json({
                errors: "Password Incorrect"
            });

        }

        if (!newPassword) {
            return res.status(404).json({
                errors: ERROR_MESSAGE.PASSWORD_BLANK
            });
        }

        await userService.updatePassword(id, {
            password: newPassword
        });


        res.status(200).json({
            message: SUCCESS_MESSAGE.UPDATE_USER_SUCCESS,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.UPDATE_USER_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}

export default updatePassword;
