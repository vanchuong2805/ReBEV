import jwtService from "../../services/auth/jwtService.js";


/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     description: API này cho phép người dùng **đăng xuất** bằng cách vô hiệu hóa token truy cập hiện tại (access token). Token phải được gửi trong phần **Authorization Header** dưới dạng Bearer token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       400:
 *         description: Yêu cầu không hợp lệ (Bad request)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *       401:
 *         description: Không có quyền truy cập (thiếu hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
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

