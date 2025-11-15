import userContactService from "../../services/user/userContactService.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       description: Represents a user's contact information
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique ID of the contact
 *           example: 1
 *         user_id:
 *           type: integer
 *           description: ID of the user this contact belongs to
 *           example: 5
 *         detail:
 *           type: string
 *           description: Detailed street address
 *           example: "123 Nguyen Van Linh, Ward 5"
 *         ward_code:
 *           type: string
 *           description: Administrative ward code
 *           example: "W123"
 *         ward_name:
 *           type: string
 *           description: Name of the ward
 *           example: "Ward 5"
 *         district_id:
 *           type: integer
 *           description: Administrative district ID
 *           example: 45
 *         district_name:
 *           type: string
 *           description: Name of the district
 *           example: "District 7"
 *         province_id:
 *           type: integer
 *           description: Province or city ID
 *           example: 79
 *         province_name:
 *           type: string
 *           description: Name of the province or city
 *           example: "Ho Chi Minh City"
 *         name:
 *           type: string
 *           description: Full name of the contact person
 *           example: "Nguyen Van A"
 *         phone:
 *           type: string
 *           description: Phone number of the contact
 *           example: "0901234567"
 *         is_default:
 *           type: boolean
 *           description: Indicates if this contact is the default contact for the user
 *           example: true
 *         is_deleted:
 *           type: boolean
 *           description: Indicates if the contact has been deleted
 *           example: false
 *
 * /api/contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     description: >
 *       Fetch all contact records from the system.  
 *       You can optionally filter results by `user_id` to get contacts for a specific user or by `name` to search for contacts with a matching name (partial match is supported).  
 *       - Returns an array of contacts if any exist.  
 *       - Returns a 404 error if no contacts match the filter criteria.  
 *       - Returns a 500 error in case of internal server issues.
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *         description: Filter contacts by the ID of the user
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: name
 *         required: false
 *         description: Filter contacts by contact name (supports partial match)
 *         schema:
 *           type: string
 *           example: "Nguyen"
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of contacts matching the filter criteria
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *             examples:
 *               contactsExample:
 *                 summary: Example list of contacts
 *                 value:
 *                   - id: 1
 *                     user_id: 5
 *                     detail: "123 Nguyen Van Linh, Ward 5"
 *                     ward_code: "W123"
 *                     ward_name: "Ward 5"
 *                     district_id: 45
 *                     district_name: "District 7"
 *                     province_id: 79
 *                     province_name: "Ho Chi Minh City"
 *                     name: "Nguyen Van A"
 *                     phone: "0901234567"
 *                     is_default: true
 *                     is_deleted: false
 *                   - id: 2
 *                     user_id: 5
 *                     detail: "456 Le Loi, Ward 1"
 *                     ward_code: "W456"
 *                     ward_name: "Ward 1"
 *                     district_id: 1
 *                     district_name: "District 1"
 *                     province_id: 79
 *                     province_name: "Ho Chi Minh City"
 *                     name: "Le Thi B"
 *                     phone: "0912345678"
 *                     is_default: false
 *                     is_deleted: false
 *       404:
 *         description: No contacts found matching the filter criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message when no contacts exist
 *                   example: "No contacts found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server failures
 *                   example: "Failed to get contacts"
 */


const getContacts = async (req, res) => {
    try {
        const option = req.query;

        const contacts = await userContactService.getUserContacts(option);

        res.status(200).json(contacts);

    } catch (error) {
        console.error("Failed to get contacts:", error);
        res.status(500).json({ error: "Failed to get contacts" });
    }
};

export default getContacts;