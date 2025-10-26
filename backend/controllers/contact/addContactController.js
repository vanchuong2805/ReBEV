import userContactService from "../../services/user/userContactService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/contacts/add:
 *   post:
 *     summary: Add a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *         description: Contact added successfully
 *       400:
 *         description: Bad request
 */

const addUserContactDetail = async (req, res) => {
    try {
        const {
            user_id,
            detail,
            ward_code,
            ward_name,
            district_id,
            district_name,
            province_id,
            province_name,
            name,
            phone } = req.body;

        const user = await userContactService.getUserContactsByUserId(user_id);
        
        const errors = [];

        if (!user) {
            errors.push(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        if (!detail) {
            errors.push(ERROR_MESSAGE.CONTACT_DETAIL_BLANK);
        }
        if (!name) {
            errors.push(ERROR_MESSAGE.CONTACT_NAME_BLANK);
        }
        if (!phone) {
            errors.push(ERROR_MESSAGE.CONTACT_PHONE_BLANK);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                errors: errors
            });
        }

        const newContactDetail = await userContactService.createUserContact({
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
            message: SUCCESS_MESSAGE.ADD_CONTACT_DETAIL_SUCCESS,
            contact: newContactDetail,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.ADD_CONTACT_DETAIL_FAIL, error);
        res.status(400).json({
            error: error.message
        })
    }
}
export default addUserContactDetail;