import userContactService from "../../services/user/userContactService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";


/** 
 * @swagger
 * /api/contacts/{id}/set-default:
 *   patch:
 *     summary: Set a contact as default
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact to set as default
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact set as default successfully
 *       400:
 *         description: Contact not found or not owned by user
 *       500:
 *         description: Internal server error
 */


const setDefaultContact = async (req, res) => {
    const contactId = req.params.id;
    const userId = req.user.id;
    try {
        const contact = await userContactService.getUserContact(contactId);

        if (!contact) {
            return res.status(404).json({
                errors: ERROR_MESSAGE.CONTACT_NOT_FOUND
            });
        }
        if (contact.user_id !== userId) {
            return res.status(403).json({
                errors: ERROR_MESSAGE.UNAUTHORIZED_ACTION
            });
        }

        const updatedContact = await userContactService.setDefaultContact({
            id: contactId,
            user_id: userId
        });

        if (!updatedContact) {
            return res.status(400).json({
                errors: ERROR_MESSAGE.CONTACT_UPDATE_FAILED
            });
        }

        return res.status(200).json({
            message: SUCCESS_MESSAGE.CONTACT_UPDATED,
            data: updatedContact
        });
    } catch (error) {
        return res.status(500).json({
            errors: error.message
        });
    }
};

export default setDefaultContact;