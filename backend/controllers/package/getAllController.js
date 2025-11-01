import packageService from "../../services/package/packageService.js";

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: Lấy danh sách tất cả các gói dịch vụ
 *     tags: [Packages]
 *     description: API cho phép lấy danh sách tất cả các gói dịch vụ hiện có trong hệ thống. Các gói có thể bao gồm thông tin như tên, giá, mô tả, thời lượng, và trạng thái nổi bật.
 *     responses:
 *       200:
 *         description: Lấy danh sách gói dịch vụ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Premium Package"
 *                   description:
 *                     type: string
 *                     example: "Gói cao cấp cho phép đăng 50 bài viết và được hiển thị nổi bật trong 30 ngày."
 *                   price:
 *                     type: number
 *                     example: 499000
 *                   highlight:
 *                     type: boolean
 *                     example: true
 *                   top:
 *                     type: boolean
 *                     example: true
 *                   duration:
 *                     type: integer
 *                     example: 30
 *                   is_deleted:
 *                     type: boolean
 *                     example: false
 *       500:
 *         description: Lỗi máy chủ nội bộ trong quá trình lấy danh sách gói dịch vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get packages"
 */

const getAll = async (req, res) => {
    try {

        const packages = await packageService.getPackages();

        res.status(200).json(packages);

    } catch (error) {
        console.error("Failed to get packages:", error);
        res.status(500).json({ error: "Failed to get packages" });
    }
}

export default getAll;
