import jwtService from "../../services/auth/jwtService.js";
import userService from "../../services/user/userService.js";
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Lấy access token mới bằng refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lấy access token mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "newAccessToken"
 *       401:
 *         description: Không có refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No refresh token provided."
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided.' });
    }

    try {
        const decode = jwt.decode(refreshToken);

        await jwtService.verifyRefreshToken(decode.userId, refreshToken);

        const user = await userService.getUser(decode.userId);
        const payload = {
            id: user.id,
            display_name: user.display_name,
            role: user.role,
            avatar: user.avatar,
            package_id: user.package_id,
            package_start: user.package_start,
        }

        const newAccessToken = jwtService.createAccessToken(payload);
        res.status(200).json({
            accessToken: newAccessToken,
            user: payload
        });


    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Server error.' });
    }

}
export default refreshToken;