import jwtService from "../../services/auth/jwtService.js";


/** 
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     description: Logs out the user by invalidating the token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
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

