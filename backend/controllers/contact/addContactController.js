import userContactService from "../../services/user/userContactService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/contacts/add:
 *   post:
 *     summary: Add a new contact for a user
 *     description: >
 *       This API allows adding a new contact address for a specific user.  
 *       - Each user can have multiple contacts.  
 *       - Required fields must be provided: `user_id`, `detail`, `ward_code`, `ward_name`, `district_id`, `district_name`, `province_id`, `province_name`, `name`, `phone`.  
 *       - The optional field `is_default` can be provided to mark this contact as the default one. Default is `false`.  
 *       - The API validates that the user exists and that all required fields are not empty.  
 *       - Returns the newly created contact object upon success.
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       description: Information of the contact to add
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
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
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user to whom the contact belongs
 *                 example: 10
 *               detail:
 *                 type: string
 *                 description: Detailed street address
 *                 example: "123 Le Loi, Ben Nghe Ward"
 *               ward_code:
 *                 type: string
 *                 description: Administrative ward code
 *                 example: "001"
 *               ward_name:
 *                 type: string
 *                 description: Name of the ward
 *                 example: "Ben Nghe"
 *               district_id:
 *                 type: integer
 *                 description: Administrative district ID
 *                 example: 1
 *               district_name:
 *                 type: string
 *                 description: Name of the district
 *                 example: "District 1"
 *               province_id:
 *                 type: integer
 *                 description: Province or city ID
 *                 example: 79
 *               province_name:
 *                 type: string
 *                 description: Name of the province or city
 *                 example: "Ho Chi Minh City"
 *               name:
 *                 type: string
 *                 description: Full name of the contact person
 *                 example: "Nguyen Van A"
 *               phone:
 *                 type: string
 *                 description: Phone number of the contact
 *                 example: "0909123456"
 *               is_default:
 *                 type: boolean
 *                 description: Indicates if this contact is the default one for the user
 *                 example: false
 *     responses:
 *       200:
 *         description: Contact added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact added successfully"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 10
 *                     detail:
 *                       type: string
 *                       example: "123 Le Loi, Ben Nghe Ward"
 *                     ward_code:
 *                       type: string
 *                       example: "001"
 *                     ward_name:
 *                       type: string
 *                       example: "Ben Nghe"
 *                     district_id:
 *                       type: integer
 *                       example: 1
 *                     district_name:
 *                       type: string
 *                       example: "District 1"
 *                     province_id:
 *                       type: integer
 *                       example: 79
 *                     province_name:
 *                       type: string
 *                       example: "Ho Chi Minh City"
 *                     name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     phone:
 *                       type: string
 *                       example: "0909123456"
 *                     is_default:
 *                       type: boolean
 *                       example: false
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid input data or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["User not found", "Detail cannot be empty", "Phone cannot be empty"]
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Add contact failed"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
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