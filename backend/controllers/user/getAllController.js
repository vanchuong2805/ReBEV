import userService from "../../services/user/userService.js";

/** 
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng người dùng mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       500:
 *         description: Lỗi server
 */
const getAll = async (req, res) => {
    try {
        const option = req.query;

        const users = await userService.getUsers(option);
        res.status(200).json(users);

    } catch (error) {
        console.error("Failed to get users:", error);
        res.status(500).json({ error: "Failed to get users" });
    }
};

export default getAll;