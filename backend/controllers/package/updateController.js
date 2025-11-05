import packageService from "../../services/package/packageService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/packages/{id}/update:
 *   put:
 *     summary: Cập nhật thông tin gói dịch vụ
 *     tags: [Packages]
 *     description: API cho phép cập nhật thông tin của một gói dịch vụ dựa trên ID. Gói cũ sẽ được đánh dấu xóa và tạo mới gói thay thế với thông tin được cập nhật.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của gói dịch vụ cần cập nhật
 *         schema:
 *           type: integer
 *           example: 3
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
 *                 example: "Premium 2.0 Package"
 *               description:
 *                 type: string
 *                 example: "Gói cao cấp mới cho phép đăng 100 bài viết trong 60 ngày, được ưu tiên hiển thị hàng đầu."
 *               price:
 *                 type: number
 *                 example: 799000
 *               highlight:
 *                 type: boolean
 *                 example: true
 *               top:
 *                 type: boolean
 *                 example: true
 *               duration:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       200:
 *         description: Cập nhật gói dịch vụ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update package successfully"
 *                 oldPackageId:
 *                   type: integer
 *                   example: 3
 *                 package:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     name:
 *                       type: string
 *                       example: "Premium 2.0 Package"
 *                     description:
 *                       type: string
 *                       example: "Gói cao cấp mới cho phép đăng 100 bài viết trong 60 ngày."
 *                     price:
 *                       type: number
 *                       example: 799000
 *                     highlight:
 *                       type: boolean
 *                       example: true
 *                     top:
 *                       type: boolean
 *                       example: true
 *                     duration:
 *                       type: integer
 *                       example: 60
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Gói dịch vụ không tồn tại hoặc đã bị xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "PACKAGE_NOT_FOUND"
 *       500:
 *         description: Lỗi máy chủ trong quá trình cập nhật gói dịch vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "UPDATE_PACKAGE_FAIL"
 */
const updatePackage = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const {
            name,
            price,
            description,
            highlight,
            top,
            duration } = req.body;

        const oldPackages = await packageService.getPackage(id);

        if (!oldPackages) {
            return res.status(400).json({
                error: ERROR_MESSAGE.PACKAGE_NOT_FOUND
            });
        }

        if (await packageService.is_deleted(id)) {
            return res.status(400).json({
                error: ERROR_MESSAGE.PACKAGE_NOT_FOUND
            });
        } else {
            await packageService.deletePackage(id);
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
            message: SUCCESS_MESSAGE.UPDATE_PACKAGE_SUCCESS,
            oldPackageId: id,
            package: newPackage,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.UPDATE_PACKAGE_FAIL, error);
        res.status(500).json({
            error: error.message
        });
    }
}

export default updatePackage;