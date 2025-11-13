import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";


/**
 * @swagger
 * /api/users/{id}/update-password:
 *   put:
 *     summary: Update user password
 *     description: Allows a user to update their own password. Requires authentication and verification of the old password before setting the new password.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user who wants to update their password
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
 *                 description: Current password of the user
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 description: New password to set
 *                 example: "NewPassword456!"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Old password is incorrect or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Old password is incorrect"
 *       403:
 *         description: User not authorized to update another user's password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: User not found or new password is blank
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Password cannot be blank"
 *       500:
 *         description: Internal server error while updating password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update password"
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
