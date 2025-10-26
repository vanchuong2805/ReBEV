import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";


/** 
 * @swagger
 * /api/users/{id}/update-password:
 *   put:
 *     summary: Cập nhật mật khẩu người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: integer
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật mật khẩu thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       403:
 *         description: Người dùng không có quyền truy cập
 */
const updatePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if (parseInt(id) !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { oldPassword, newPassword } = req.body;

        const isPasswordCorrect = await userService.checkPassword(id, { password: oldPassword });

        if (!isPasswordCorrect) {
            return res.status(400).json({ errors: "Password Incorrect" });

        }

        if (!newPassword) {
            return res.status(404).json({ errors: ERROR_MESSAGE.PASSWORD_BLANK })
        }

        await userService.updatePassword(id, { password: newPassword });


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
