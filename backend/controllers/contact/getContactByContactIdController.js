import userContactService from "../../services/user/userContactService.js";


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
 *           example: 12
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
 *           example: true
 *         is_deleted:
 *           type: boolean
 *           example: false
 *
 * /api/contacts/contact/{contactId}:
 *   get:
 *     summary: Get a contact by its ID
 *     description: Retrieve a specific contact by contact ID.
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         description: The ID of the contact to retrieve
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
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
