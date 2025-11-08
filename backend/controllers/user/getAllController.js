import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a paginated list of users
 *     description: |
 *       Retrieve a list of users with pagination.  
 *       - If no query parameters are provided, defaults to **page 1** and **limit 10**.  
 *       - Each user object includes account info, role, balance, avatar, package, and timestamps.  
 *       - Balance is returned as a string to preserve decimal precision.  
 *     tags: [Users]
 *     operationId: getAllUsers
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         required: false
 *         description: Page number to retrieve (starting from 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         required: false
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *             examples:
 *               default:
 *                 summary: Example response
 *                 value:
 *                   total: 50
 *                   page: 1
 *                   limit: 10
 *                   users:
 *                     - id: 1
 *                       display_name: "Nguyen Van A"
 *                       phone: "0901234567"
 *                       email: "vana@example.com"
 *                       role: 0
 *                       balance: "150000.00"
 *                       avatar: "https://example.com/avatar.jpg"
 *                       package_id: 2
 *                       is_locked: false
 *                       create_at: "2025-01-01T07:00:00Z"
 *                       update_at: "2025-10-30T09:00:00Z"
 *
 *       400:
 *         description: Invalid query parameters (e.g., page or limit is not a number)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               invalidQuery:
 *                 summary: Invalid query example
 *                 value:
 *                   message: "Invalid query parameters"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *             examples:
 *               dbFailure:
 *                 summary: Failed to fetch users
 *                 value:
 *                   error: "Failed to get users"
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         display_name:
 *           type: string
 *           example: "Nguyen Van A"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         email:
 *           type: string
 *           example: "vana@example.com"
 *         role:
 *           type: integer
 *           description: "0 = customer, 1 = staff, 2 = admin"
 *           example: 0
 *         balance:
 *           type: string
 *           description: "Account balance (decimal as string)"
 *           example: "150000.00"
 *         avatar:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 *         package_id:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         is_locked:
 *           type: boolean
 *           example: false
 *         create_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T07:00:00Z"
 *         update_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-30T09:00:00Z"
 *
 *     UserListResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 50
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *
 *     BadRequestError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid query parameters"
 *
 *     ServerError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Failed to get users"
 */

const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await userService.getUsers({ page, limit });

        res.status(200).json(users);

    } catch (error) {
        console.error("Failed to get users:", error);
        res.status(500).json({ error: "Failed to get users" });
    }
};

export default getAll;