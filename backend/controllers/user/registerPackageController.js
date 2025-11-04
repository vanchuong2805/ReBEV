import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js';
import packageService from '../../services/package/packageService.js';
import e from 'express';
import momoService from '../../services/payment/momoService.js';

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               redirectUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/redirect"
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

const registerPackage = async (req, res) => {
    try {
        const { user_id, package_id } = req.params;
        const { redirectUrl } = req.body;
        const userId = req.user.id;

        if (parseInt(user_id) !== userId) {
            return res.status(403).json({
                error: 'Forbidden',
            });
        }

        const errors = [];
        const user = await userService.getUser(user_id);
        const packages = await packageService.getPackage(package_id);
        if (!redirectUrl) {
            errors.push("RedirectUrl is required");
        }
        if (!user) {
            errors.push(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        if (!packages) {
            errors.push(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
        }
        if (await packageService.is_deleted(package_id)) {
            errors.push(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
        }
        if (errors.length > 0) {
            return res.status(404).json({ errors });
        }

        // Tạo payUrl để thanh toán 

        const paymentInfo = {
            amount: packages.price,
            orderId: `${user_id}-${package_id}-${Date.now()}`,
            orderInfo: `Register package ${packages.name} for user ${user.display_name}`,
            extraData: JSON.stringify({ user_id, package_id }),
            redirectUrl,
            ipnUrl: process.env.INTERNAL_API_URL + '/transactions/package',
        }   

        const result = await momoService.createPayment(paymentInfo);
        if (!result.payUrl) {
            return res.status(500).json({
                error: 'Failed to create payment URL',
            });
        }
        res.status(200).json({
            payUrl: result.payUrl,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.REGISTER_FAIL, error);
        res.status(400).json({
            error: error.message,
        });
    }
};

export default registerPackage;
