import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     description: Trả về danh sách người dùng có phân trang. Nếu không truyền tham số, mặc định lấy trang 1 với giới hạn 10 người dùng.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang muốn lấy (bắt đầu từ 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số lượng người dùng trên mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       display_name:
 *                         type: string
 *                         example: "Nguyen Van A"
 *                       phone:
 *                         type: string
 *                         example: "0901234567"
 *                       email:
 *                         type: string
 *                         example: "vana@example.com"
 *                       role:
 *                         type: integer
 *                         description: "0 = khách hàng, 1 = nhân viên, 2 = admin"
 *                         example: 0
 *                       balance:
 *                         type: string
 *                         description: "Số dư tài khoản (decimal, trả về dạng chuỗi)"
 *                         example: "150000.00"
 *                       avatar:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *                       package_id:
 *                         type: integer
 *                         nullable: true
 *                         example: 2
 *                       is_locked:
 *                         type: boolean
 *                         example: false
 *                       create_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T07:00:00Z"
 *                       update_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-30T09:00:00Z"
 *
 *       400:
 *         description: 'Tham số truy vấn không hợp lệ (ví dụ: page hoặc limit không phải là số)'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
 *
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get users"
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