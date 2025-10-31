import userContactService from '../../services/user/userContactService.js';
import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';

/** 
 * @swagger
 * /api/contacts/update:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               detail:
 *                 type: string
 *               ward_code:
 *                 type: string
 *               ward_name:
 *                 type: string
 *               district_id:
 *                 type: string
 *               district_name:
 *                 type: string
 *               province_id:
 *                 type: string
 *               province_name:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Bad request
 */

const updateContact = async (req, res) => {
    try {
        const {
            id,
            user_id,
            detail,
            ward_code,
            ward_name,
            district_id,
            district_name,
            province_id,
            province_name,
            name,
            phone
        } = req.body;

        const contact_id = await userContactService.getUserContact(id);
        
        const user = await userContactService.getUserById(user_id);
        const error = [];

        if (!contact_id) {
            error.push(ERROR_MESSAGE.CONTACT_NOT_FOUND);
        }

        if (!user) {
            error.push(ERROR_MESSAGE.USER_NOT_FOUND);
        }

        if (!detail) {
            error.push(ERROR_MESSAGE.CONTACT_DETAIL_BLANK);
        }

        if (!name) {
            error.push(ERROR_MESSAGE.CONTACT_NAME_BLANK);
        }
        if (!phone) {
            error.push(ERROR_MESSAGE.CONTACT_PHONE_BLANK);
        }


        if (error.length > 0) {
            return res.status(400).json({ errors: error });
        }

        const updatedContact = await userContactService.updateUserContact({
            id,
            user_id,
            detail,
            ward_code,
            ward_name,
            district_id,
            district_name,
            province_id,
            province_name,
            name,
            phone
        });
        res.status(200).json({
            message: SUCCESS_MESSAGE.UPDATE_CONTACT_DETAIL_SUCCESS,
            contact: updatedContact
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.UPDATE_CONTACT_DETAIL_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
};
export default updateContact;