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
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     description: Retrieve all contacts from the system. You can optionally filter results by `user_id` or `name`.
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *         description: Filter contacts by user ID
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
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       404:
 *         description: No contacts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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