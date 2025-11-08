import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";
import packageService from "../../services/package/packageService.js";

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
        const {
            user_id,
            package_id
        } = req.params;

        const userId = req.user.id;

        if (parseInt(user_id) !== userId) {
            return res.status(403).json({
                error: "Forbidden"
            });
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
        if (await packageService.is_deleted(package_id)) {
            errors.push(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
            return res.status(400).json({ errors });
        }
        const updatedPackages = await userService.updatePackage(user_id, {
            package_id
        });

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