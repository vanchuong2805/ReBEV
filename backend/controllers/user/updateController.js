import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

/** 
 * @swagger
 * /api/users/{id}/update:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       403:
 *         description: Người dùng không có quyền truy cập
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

        const data = {};

        if (display_name) {
            data.display_name = display_name;
        }

        const newUser = await userService.updateUser(id, {
            avatar,
            ...data,
            update_at: new Date()
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