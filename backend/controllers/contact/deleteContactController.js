import userContactService from '../../services/user/userContactService.js'
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/contacts/delete/{id}:
 *   delete:
 *     summary: Delete a user contact
 *     description: Permanently delete a contact record by its ID if it exists.
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to delete
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact deleted successfully
 *                 contact:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     user_id:
 *                       type: integer
 *                       example: 15
 *                     detail:
 *                       type: string
 *                       example: "123 Lê Lợi, Phường Bến Thành"
 *                     ward_code:
 *                       type: string
 *                       example: "27403"
 *                     ward_name:
 *                       type: string
 *                       example: "Phường Bến Thành"
 *                     district_id:
 *                       type: integer
 *                       example: 769
 *                     district_name:
 *                       type: string
 *                       example: "Quận 1"
 *                     province_id:
 *                       type: integer
 *                       example: 79
 *                     province_name:
 *                       type: string
 *                       example: "Thành phố Hồ Chí Minh"
 *                     name:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     phone:
 *                       type: string
 *                       example: "0901234567"
 *                     is_default:
 *                       type: boolean
 *                       example: false
 *                     is_deleted:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Contact not found or failed to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: Contact not found
 *       500:
 *         description: Internal server error while deleting the contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete contact
 */

const deleteContact = async (req, res) => {
    try {
        const {
            id,
        } = req.params;

        const contact = await userContactService.getUserContact(id);

        if (!contact) {
            return res.status(400).json({ errors: ERROR_MESSAGE.CONTACT_NOT_FOUND });
        }

        res.status(200).json({
            message: SUCCESS_MESSAGE.DELETE_CONTACT_SUCCESS,
            contact: await userContactService.deleteUserContact({ id }),
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.DELETE_CONTACT_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}
export default deleteContact;