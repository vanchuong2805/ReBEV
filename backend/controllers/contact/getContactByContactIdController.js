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
 *           example: 12
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
 *           description: Indicates if the contact is deleted
 *           example: false
 *
 * /api/contacts/contact/{contactId}:
 *   get:
 *     summary: Retrieve a contact by its ID
 *     description: >
 *       Fetch a specific contact's information using its unique contact ID.  
 *       - Returns full contact details if the contact exists.  
 *       - Returns a 404 error if the contact does not exist.  
 *       - Returns a 500 error in case of internal server issues.
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         description: The unique ID of the contact to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *             examples:
 *               contactExample:
 *                 summary: Example contact
 *                 value:
 *                   id: 1
 *                   user_id: 12
 *                   detail: "123 Nguyen Van Linh, Ward 5"
 *                   ward_code: "W123"
 *                   ward_name: "Ward 5"
 *                   district_id: 45
 *                   district_name: "District 7"
 *                   province_id: 79
 *                   province_name: "Ho Chi Minh City"
 *                   name: "Nguyen Van A"
 *                   phone: "0901234567"
 *                   is_default: true
 *                   is_deleted: false
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message when contact does not exist
 *                   example: "Contact not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for internal server failures
 *                   example: "Internal server error"
 */

const getContactByContactId = async (req, res) => {
    try {
        const contactId = req.params.contactId;
        const contact = await userContactService.getUserContact(contactId);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        return res.status(200).json(contact);
    } catch (error) {
        console.error("Error fetching contact:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getContactByContactId;
