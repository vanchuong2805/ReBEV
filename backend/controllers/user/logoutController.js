import jwtService from "../../services/auth/jwtService.js";


/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     description: |
 *       Allows a user to **logout** by invalidating the current access token.  
 *       The token must be sent in the **Authorization header** as a Bearer token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       400:
 *         description: Bad request (invalid request or token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await jwtService.logout(req.user.id, token);

        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.error("Error occurred during logout:", error);
        res.status(400).json({
            message: "Bad request"
        });
    }
}

export default logout;

