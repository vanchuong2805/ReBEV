import userContactService from "../../services/user/userContactService.js";

/** 
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
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