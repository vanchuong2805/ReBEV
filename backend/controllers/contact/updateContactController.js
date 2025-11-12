import userContactService from '../../services/user/userContactService.js';
import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 5
 *         detail:
 *           type: string
 *           example: "123 Nguyen Van Linh, Ward 5"
 *         ward_code:
 *           type: string
 *           example: "W123"
 *         ward_name:
 *           type: string
 *           example: "Ward 5"
 *         district_id:
 *           type: integer
 *           example: 45
 *         district_name:
 *           type: string
 *           example: "District 7"
 *         province_id:
 *           type: integer
 *           example: 79
 *         province_name:
 *           type: string
 *           example: "Ho Chi Minh City"
 *         name:
 *           type: string
 *           example: "Nguyen Van A"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         is_default:
 *           type: boolean
 *           example: false
 *         is_deleted:
 *           type: boolean
 *           example: false
 *
 * /api/contacts/update:
 *   put:
 *     summary: Update a contact
 *     description: Update contact information such as address, name, phone, or region details.
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - user_id
 *               - detail
 *               - ward_code
 *               - ward_name
 *               - district_id
 *               - district_name
 *               - province_id
 *               - province_name
 *               - name
 *               - phone
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the contact to update
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 description: ID of the user who owns the contact
 *                 example: 5
 *               detail:
 *                 type: string
 *                 description: Detailed address
 *                 example: "123 Nguyen Van Linh, Ward 5"
 *               ward_code:
 *                 type: string
 *                 description: Ward code
 *                 example: "W123"
 *               ward_name:
 *                 type: string
 *                 description: Ward name
 *                 example: "Ward 5"
 *               district_id:
 *                 type: integer
 *                 description: District ID
 *                 example: 45
 *               district_name:
 *                 type: string
 *                 description: District name
 *                 example: "District 7"
 *               province_id:
 *                 type: integer
 *                 description: Province ID
 *                 example: 79
 *               province_name:
 *                 type: string
 *                 description: Province name
 *                 example: "Ho Chi Minh City"
 *               name:
 *                 type: string
 *                 description: Contact name
 *                 example: "Nguyen Van A"
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *                 example: "0901234567"
 *               is_default:
 *                 type: boolean
 *                 description: Whether this contact is the default
 *                 example: false
 *               is_deleted:
 *                 type: boolean
 *                 description: Whether this contact is marked as deleted
 *                 example: false
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact updated successfully"
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Bad request - validation error or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Contact not found", "Phone cannot be blank"]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update contact"
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
            phone,
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