import userService from "../../services/user/userService.js";

/** 
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
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