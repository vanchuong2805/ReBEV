import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/{id}/update:
 *   put:
 *     summary: Update user information
 *     description: |
 *       This API allows a user to update their personal information, including display name and avatar.  
 *       - Users cannot update information of other users.  
 *       - Returns 404 if the user does not exist.  
 *       - Returns 400 if input data is missing or invalid.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
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
 *                 description: New display name of the user
 *                 example: "Nguyen Van A"
 *               avatar:
 *                 type: string
 *                 description: URL of the user's avatar
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdateResponse'
 *       400:
 *         description: Invalid request or missing data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       403:
 *         description: Forbidden – user cannot update other users' info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *
 * components:
 *   schemas:
 *     UserUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User information updated successfully"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 123
 *             display_name:
 *               type: string
 *               example: "Nguyen Van A"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *             update_at:
 *               type: string
 *               format: date-time
 *               example: "2025-10-30T08:30:00Z"
 *     BadRequestError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Missing required data or invalid format"
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Forbidden"
 *     NotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User not found"
 *     ServerError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Failed to update user information"
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