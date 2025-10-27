import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";
import packageService from "../../services/package/packageService.js";

/** 
 * @swagger
 * /api/users/{user_id}/register-package/{package_id}:
 *   post:
 *     summary: Đăng ký gói dịch vụ cho người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: integer
 *       - in: path
 *         name: package_id
 *         required: true
 *         description: ID của gói dịch vụ
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đăng ký gói dịch vụ thành công
 *       404:
 *         description: Không tìm thấy người dùng hoặc gói dịch vụ
 *       403:
 *         description: Người dùng không có quyền truy cập
 */

const registerPackage = async (req, res) => {
    try {
        const { user_id, package_id } = req.params;
        const userId = req.user.id;

        if (parseInt(user_id) !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const errors = [];
        const user = await userService.getUser(user_id);
        const packages = await packageService.getPackage(package_id);

        if (!user) {
            errors.push(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        if (!packages) {
            errors.push(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
        }
        if (errors.length > 0) {
            return res.status(404).json({ errors });
        }
        const updatedPackages = await userService.updatePackage(user_id, { package_id });
        res.status(200).json({
            message: SUCCESS_MESSAGE.REGISTER_SUCCESS,
            user: updatedPackages,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.REGISTER_FAIL, error);
        res.status(400).json({
            error: error.message,
        });
    }
}

export default registerPackage;