import userContactService from "../../services/user/userContactService.js";

/** 
 * @swagger
 * /api/contacts/contact/{contactId}:
 *   get:
 *     summary: Get a contact by ID
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         description: The ID of the contact to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
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
