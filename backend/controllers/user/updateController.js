import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/{id}/update:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     description: API cho phép người dùng cập nhật thông tin cá nhân của chính họ, bao gồm tên hiển thị và ảnh đại diện.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần cập nhật
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 description: Tên hiển thị mới của người dùng
 *                 example: "Nguyen Van A"
 *               avatar:
 *                 type: string
 *                 description: URL ảnh đại diện của người dùng
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin người dùng thành công"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     display_name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     update_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-30T08:30:00Z"
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc dữ liệu bị thiếu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Thiếu dữ liệu cần thiết hoặc định dạng không hợp lệ"
 *       403:
 *         description: Người dùng không có quyền truy cập (không thể cập nhật thông tin người khác)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy người dùng"
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi cập nhật thông tin người dùng"
 */

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const userId = req.user.id;

        if (parseInt(id) !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const {
            display_name,
            avatar
        } = req.body;

        const error = [];

        if (!display_name) {
            error.push(ERROR_MESSAGE.DISPLAY_NAME_BLANK);
        }

        const newUser = await userService.updateUser(id, {
            display_name,
            update_at: new Date(),
            avatar
        });
        res.status(200).json({
            message: SUCCESS_MESSAGE.UPDATE_USER_SUCCESS,
            user: newUser,
        });

        if (error.length > 0) {
            return res.status(400).json({ errors: error });
        }

    } catch (error) {
        console.error(ERROR_MESSAGE.UPDATE_USER_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}

export default updateUser;