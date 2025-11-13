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
 * /api/contacts/{id}:
 *   get:
 *     summary: Retrieve all contacts by user ID
 *     description: >
 *       Fetch all contact records associated with a specific user.  
 *       - Returns an array of contacts if any exist.  
 *       - Returns a 404 error if the user has no contacts.  
 *       - Returns a 500 error in case of internal server issues.
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user whose contacts will be retrieved
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of contacts belonging to the user
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
 *         description: No contacts found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message when no contacts exist for the user
 *                   example: "Contact not found"
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
 *                   example: "Failed to get contact"
 */

const getContact = async (req, res) => {
    try {
        const contact = await userContactService.getUserContactsByUserId(req.params.id);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.status(200).json(contact);

    } catch (error) {
        console.error("Failed to get contact:", error);
        res.status(500).json({ error: "Failed to get contact" });
    }
};

export default getContact;