import getStatistics from "../../services/admin/getStatisticsService.js";

/**
 * @swagger
 * /api/statistics:
 *   get:
 *     summary: Lấy thống kê hệ thống theo năm
 *     tags: [Statistics]
 *     description: API cho phép lấy các thống kê tổng hợp trong hệ thống như tổng người dùng, tổng bài viết, tổng giao dịch, doanh thu theo tháng và tổng doanh thu theo loại giao dịch.
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         description: Năm cần lấy thống kê (nếu không truyền sẽ mặc định là năm hiện tại)
 *         schema:
 *           type: integer
 *           example: 2025
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get statistics successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       description: Tổng số người dùng
 *                       example: 30
 *                     totalPosts:
 *                       type: integer
 *                       description: Tổng số bài viết
 *                       example: 26
 *                     totalTransactions:
 *                       type: integer
 *                       description: Tổng số giao dịch
 *                       example: 19
 *                     monthlyRevenues:
 *                       type: array
 *                       description: Mảng gồm 13 phần tử (index 0–12), mỗi phần tử là mảng chứa các đối tượng doanh thu theo loại giao dịch của từng tháng.
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             transaction_type:
 *                               type: integer
 *                               description: Loại giao dịch
 *                               example: 5
 *                             transaction_sum:
 *                               type: number
 *                               description: Tổng số tiền giao dịch trong tháng
 *                               example: 75000
 *                             commission_sum:
 *                               type: number
 *                               description: Tổng hoa hồng giao dịch trong tháng
 *                               example: 0
 *                       example:
 *                         - []
 *                         - []
 *                         - []
 *                         - []
 *                         - []
 *                         - []
 *                         - []
 *                         - []
 *                         - []
 *                         - []
 *                         - 
 *                           - transaction_type: 5
 *                             transaction_sum: 75000
 *                             commission_sum: 0
 *                         - []
 *                         - []
 *                     monthlyTransactions:
 *                       type: array
 *                       description: Mảng chứa số lượng giao dịch theo tháng (index 1–12 tương ứng với tháng 1–12)
 *                       items:
 *                         type: integer
 *                       example: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 4, 0]
 *                     revenue:
 *                       type: array
 *                       description: Tổng doanh thu theo loại giao dịch (không phân theo tháng)
 *                       items:
 *                         type: object
 *                         properties:
 *                           transaction_type:
 *                             type: integer
 *                             description: Loại giao dịch
 *                             example: 5
 *                           transaction_sum:
 *                             type: number
 *                             description: Tổng giá trị giao dịch theo loại
 *                             example: 75000
 *                           commission_sum:
 *                             type: number
 *                             description: Tổng hoa hồng theo loại giao dịch
 *                             example: 0
 *                       example:
 *                         - transaction_type: 5
 *                           transaction_sum: 75000
 *                           commission_sum: 0
 *       500:
 *         description: Lỗi máy chủ nội bộ — xảy ra lỗi khi truy vấn dữ liệu thống kê
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */


const getStatistic = async (req, res) => {
    try {

        const { year } = req.query;

        const statistics = await getStatistics(year);

        return res.status(200).json({
            message: "Get statistics successfully",
            data: statistics
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default getStatistic;