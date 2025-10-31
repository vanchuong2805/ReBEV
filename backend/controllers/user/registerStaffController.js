import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/users/{user_id}/register-package/{package_id}:
 *   post:
 *     summary: Đăng ký gói dịch vụ cho người dùng
 *     description: |
 *       API cho phép người dùng đăng ký **gói dịch vụ (package)** theo ID.  
 *       - Chỉ người dùng có quyền tương ứng mới được phép đăng ký (kiểm tra `user_id` trùng với người đăng nhập).  
 *       - Nếu người dùng hoặc gói không tồn tại, trả về lỗi `404`.  
 *       - Nếu gói đã bị xóa (`is_deleted = true`), trả về lỗi `400`.  
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID của người dùng cần đăng ký gói
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: path
 *         name: package_id
 *         required: true
 *         description: ID của gói dịch vụ cần đăng ký
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Đăng ký gói dịch vụ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register package successfully"
 *                 user:
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
 *                     package_id:
 *                       type: integer
 *                       example: 2
 *                     package_start:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-30T10:20:45.000Z"
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc gói đã bị xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Package not found or has been deleted"
 *       403:
 *         description: Người dùng không có quyền truy cập (user_id không khớp với token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: Không tìm thấy người dùng hoặc gói dịch vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "User not found"
 *                     - "Package not found"
 *       500:
 *         description: Lỗi máy chủ nội bộ khi xử lý đăng ký
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to register package"
 */


const registerStaff = async (req, res) => {
    try {
        const {
            email,
            phone
        } = req.body;
        const error = [];

        if (!email) {
            error.push(ERROR_MESSAGE.EMAIL_BLANK);
        }

        if (error.length > 0) {
            return res.status(400).json({ errors: error });
        }

        if (phone) {
            const existingUser = await userService.getUserByPhone(phone);
            if (existingUser) {
                return res.status(400).json({
                    message: ERROR_MESSAGE.PHONE_EXISTS
                });
            }
        }

        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: ERROR_MESSAGE.EMAIL_EXISTS
            });
        }

        const newUser = await userService.createStaff({
            display_name: "",
            email,
            phone
        });

        const {
            password,
            ...userWithoutPassword
        } = newUser.dataValues;

        return res.status(201).json({
            message: SUCCESS_MESSAGE.CREATE_STAFF_SUCCESS,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: ERROR_MESSAGE.CREATE_STAFF_FAIL,
            error: error.message
        });
    }
};

export default registerStaff;
