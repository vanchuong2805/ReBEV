import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get detailed user information
 *     description: |
 *       Retrieve detailed information of a user by ID (excluding password).  
 *       Includes average rating and total number of reviews.  
 *       - If the user ID is invalid, a 400 response is returned.  
 *       - If the user is not found, a 404 response is returned.
 *     tags: [Users]
 *     operationId: getUserById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetailResponse'
 *             examples:
 *               success:
 *                 summary: Example user response
 *                 value:
 *                   user:
 *                     id: 1
 *                     display_name: "Nguyen Van A"
 *                     phone: "0901234567"
 *                     email: "vana@example.com"
 *                     role: 0
 *                     balance: "1000.50"
 *                     avatar: "https://example.com/avatar.jpg"
 *                     package_id: 2
 *                     is_locked: false
 *                     package_start: "2025-10-01T07:00:00Z"
 *                     create_at: "2025-01-01T08:00:00Z"
 *                     update_at: "2025-10-30T09:00:00Z"
 *                   rating:
 *                     average_rating: 4.5
 *                     total_reviews: 12
 *
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               invalidId:
 *                 summary: Invalid user ID example
 *                 value:
 *                   message: "Invalid user ID"
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               userNotFound:
 *                 summary: User not found example
 *                 value:
 *                   error: "User not found"
 *
 *       500:
 *         description: Internal server error while fetching user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *             examples:
 *               serverFailure:
 *                 summary: Server error example
 *                 value:
 *                   error: "Failed to get user"
 *
 * components:
 *   schemas:
 *     UserDetailResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             display_name:
 *               type: string
 *               example: "Nguyen Van A"
 *             phone:
 *               type: string
 *               example: "0901234567"
 *             email:
 *               type: string
 *               example: "vana@example.com"
 *             role:
 *               type: integer
 *               description: "0 = customer (default), other values depend on app"
 *               example: 0
 *             balance:
 *               type: string
 *               description: "Decimal as string (precision preserved)"
 *               example: "1000.50"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *             package_id:
 *               type: integer
 *               nullable: true
 *               example: 2
 *             is_locked:
 *               type: boolean
 *               example: false
 *             package_start:
 *               type: string
 *               format: date-time
 *               example: "2025-10-01T07:00:00Z"
 *             create_at:
 *               type: string
 *               format: date-time
 *               example: "2025-01-01T08:00:00Z"
 *             update_at:
 *               type: string
 *               format: date-time
 *               example: "2025-10-30T09:00:00Z"
 *         rating:
 *           type: object
 *           properties:
 *             average_rating:
 *               type: number
 *               format: float
 *               example: 4.5
 *             total_reviews:
 *               type: integer
 *               example: 12
 *
 *     BadRequestError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid user ID"
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "User not found"
 *
 *     ServerError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Failed to get user"
 *//**
* @swagger
* /api/users/{id}:
*   get:
*     summary: Get detailed user information
*     description: |
*       Retrieve detailed information of a user by ID (excluding password).  
*       Includes average rating and total number of reviews.  
*       - If the user ID is invalid, a 400 response is returned.  
*       - If the user is not found, a 404 response is returned.
*     tags: [Users]
*     operationId: getUserById
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*           example: 1
*         description: ID of the user to retrieve
*     responses:
*       200:
*         description: Successfully retrieved user information
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UserDetailResponse'
*             examples:
*               success:
*                 summary: Example user response
*                 value:
*                   user:
*                     id: 1
*                     display_name: "Nguyen Van A"
*                     phone: "0901234567"
*                     email: "vana@example.com"
*                     role: 0
*                     balance: "1000.50"
*                     avatar: "https://example.com/avatar.jpg"
*                     package_id: 2
*                     is_locked: false
*                     package_start: "2025-10-01T07:00:00Z"
*                     create_at: "2025-01-01T08:00:00Z"
*                     update_at: "2025-10-30T09:00:00Z"
*                   rating:
*                     average_rating: 4.5
*                     total_reviews: 12
*
*       400:
*         description: Invalid user ID
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/BadRequestError'
*             examples:
*               invalidId:
*                 summary: Invalid user ID example
*                 value:
*                   message: "Invalid user ID"
*
*       404:
*         description: User not found
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/NotFoundError'
*             examples:
*               userNotFound:
*                 summary: User not found example
*                 value:
*                   error: "User not found"
*
*       500:
*         description: Internal server error while fetching user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/ServerError'
*             examples:
*               serverFailure:
*                 summary: Server error example
*                 value:
*                   error: "Failed to get user"
*
* components:
*   schemas:
*     UserDetailResponse:
*       type: object
*       properties:
*         user:
*           type: object
*           properties:
*             id:
*               type: integer
*               example: 1
*             display_name:
*               type: string
*               example: "Nguyen Van A"
*             phone:
*               type: string
*               example: "0901234567"
*             email:
*               type: string
*               example: "vana@example.com"
*             role:
*               type: integer
*               description: "0 = customer (default), other values depend on app"
*               example: 0
*             balance:
*               type: string
*               description: "Decimal as string (precision preserved)"
*               example: "1000.50"
*             avatar:
*               type: string
*               example: "https://example.com/avatar.jpg"
*             package_id:
*               type: integer
*               nullable: true
*               example: 2
*             is_locked:
*               type: boolean
*               example: false
*             package_start:
*               type: string
*               format: date-time
*               example: "2025-10-01T07:00:00Z"
*             create_at:
*               type: string
*               format: date-time
*               example: "2025-01-01T08:00:00Z"
*             update_at:
*               type: string
*               format: date-time
*               example: "2025-10-30T09:00:00Z"
*         rating:
*           type: object
*           properties:
*             average_rating:
*               type: number
*               format: float
*               example: 4.5
*             total_reviews:
*               type: integer
*               example: 12
*
*     BadRequestError:
*       type: object
*       properties:
*         message:
*           type: string
*           example: "Invalid user ID"
*
*     NotFoundError:
*       type: object
*       properties:
*         error:
*           type: string
*           example: "User not found"
*
*     ServerError:
*       type: object
*       properties:
*         error:
*           type: string
*           example: "Failed to get user"
*/

const getUser = async (req, res) => {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });

        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Failed to get user:", error);
        res.status(500).json({ error: "Failed to get user" });
    }
};

export default getUser;