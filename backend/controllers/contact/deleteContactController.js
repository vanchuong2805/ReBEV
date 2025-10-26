import userContactService from '../../services/user/userContactService.js'
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/contacts/delete/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       400:
 *         description: Bad request
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