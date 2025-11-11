import packageService from "../../services/package/packageService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/packages/create:
 *   post:
 *     summary: Tạo mới một gói dịch vụ (Package)
 *     tags: [Packages]
 *     description: API cho phép quản trị viên hoặc hệ thống tạo một gói dịch vụ mới với các thông tin chi tiết như tên, mô tả, giá, thời hạn, v.v.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên gói dịch vụ
 *                 example: "Premium Package"
 *               price:
 *                 type: number
 *                 description: Giá gói (VNĐ)
 *                 example: 499000
 *               description:
 *                 type: string
 *                 description: Mô tả chi tiết về gói
 *                 example: "Gói Premium cho phép đăng bài không giới hạn và được hiển thị ưu tiên."
 *               highlight:
 *                 type: boolean
 *                 description: Gói có được đánh dấu nổi bật hay không
 *                 example: true
 *               top:
 *                 type: boolean
 *                 description: Gói có được hiển thị ở vị trí đầu danh sách hay không
 *                 example: false
 *               duration:
 *                 type: integer
 *                 description: Thời hạn sử dụng gói (tính bằng ngày)
 *                 example: 30
 *     responses:
 *       200:
 *         description: Tạo gói thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CREATE_PACKAGE_SUCCESS"
 *                 package:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "Premium Package"
 *                     price:
 *                       type: number
 *                       example: 499000
 *                     description:
 *                       type: string
 *                       example: "Gói Premium cho phép đăng bài không giới hạn và được hiển thị ưu tiên."
 *                     highlight:
 *                       type: boolean
 *                       example: true
 *                     top:
 *                       type: boolean
 *                       example: false
 *                     duration:
 *                       type: integer
 *                       example: 30
 *                     create_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-31T10:15:00.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ — thiếu thông tin bắt buộc hoặc định dạng sai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "BLANK_INFORMATION"
 *       500:
 *         description: Lỗi máy chủ nội bộ — xảy ra sự cố trong quá trình tạo gói
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "CREATE_PACKAGE_FAIL"
 */

const createPackage = async (req, res) => {

    try {
        const {
            name,
            price,
            description,
            highlight,
            top,
            duration
        } = req.body;

        if (!name || price == undefined || !description || duration == undefined) {
            return res.status(400).json({
                error: ERROR_MESSAGE.BLANK_INFORMATION
            });
        }

        const newPackage = await packageService.createPackage(
            name,
            description,
            price,
            highlight,
            top,
            duration
        );

        res.status(200).json({
            message: SUCCESS_MESSAGE.CREATE_PACKAGE_SUCCESS,
            package: newPackage,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.CREATE_PACKAGE_FAIL, error);
        res.status(500).json({
            error: error.message
        });
    }
};
export default createPackage;