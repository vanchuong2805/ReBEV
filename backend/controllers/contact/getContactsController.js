import userContactService from "../../services/user/userContactService.js";

/** 
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *         description: ID of the user to filter contacts
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         required: false
 *         description: Name of the contact to filter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *       404:
 *         description: No contacts found
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