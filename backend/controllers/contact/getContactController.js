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
 *           example: true
 *         is_deleted:
 *           type: boolean
 *           example: false
 *
 * /api/contacts/{id}:
 *   get:
 *     summary: Get all contacts by user ID
 *     description: Retrieve all contacts that belong to a specific user, identified by user ID.
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose contacts will be retrieved
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
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       404:
 *         description: No contacts found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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