import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/users/{user_id}/unlock-account:
 *   patch:
 *     summary: Unlock user account
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user to unlock
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Account unlocked successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Account already unlocked
 *       500:
 *         description: Internal server error
 */

const unLockAccount = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await userService.getUser(user_id);
        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND
            });
        }

        const isLocked = await userService.is_locked(user_id);
        if (!isLocked) {
            return res.status(400).json({
                message: ERROR_MESSAGE.ACCOUNT_ALREADY_UNLOCKED
            });
        }

        const result = await userService.unLockAccount(user_id);

        return res.status(200).json({
            message: SUCCESS_MESSAGE.ACCOUNT_UNLOCKED,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.ACCOUNT_UNLOCK_FAILED,
            error: error.message
        });
    }
};

export default unLockAccount;