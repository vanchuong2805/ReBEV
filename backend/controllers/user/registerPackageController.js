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
 *     summary: Register a service package for a user
 *     description: |
 *       This API allows a user to register a **service package** by its ID.  
 *       - Only the authorized user can register a package (checks if `user_id` matches the logged-in user).  
 *       - Returns `404` if the user or package does not exist.  
 *       - Returns `400` if the package has been deleted (`is_deleted = true`).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user registering the package
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: path
 *         name: package_id
 *         required: true
 *         description: ID of the package to register
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
 *         description: Package registered successfully
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
 *         description: Invalid request or the package has been deleted
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
 *         description: Forbidden - user does not have permission to register this package
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: User or package not found
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
 *         description: Internal server error while processing package registration
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
