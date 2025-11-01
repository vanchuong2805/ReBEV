import packageService from "../../services/package/packageService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/packages/{id}/delete:
 *   patch:
 *     summary: Xóa (đánh dấu đã xóa) một gói dịch vụ
 *     tags: [Packages]
 *     description: API cho phép xóa một gói dịch vụ dựa trên ID. Thao tác này thường là xóa mềm (soft delete), chỉ đánh dấu gói là đã xóa chứ không xóa khỏi cơ sở dữ liệu.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của gói dịch vụ cần xóa
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Xóa gói dịch vụ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "DELETE_PACKAGE_SUCCESS"
 *                 package:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Basic Package"
 *                     price:
 *                       type: number
 *                       example: 99000
 *                     description:
 *                       type: string
 *                       example: "Gói cơ bản cho phép đăng 5 bài viết trong 7 ngày."
 *                     highlight:
 *                       type: boolean
 *                       example: false
 *                     top:
 *                       type: boolean
 *                       example: false
 *                     duration:
 *                       type: integer
 *                       example: 7
 *                     is_deleted:
 *                       type: boolean
 *                       example: true
 *                     update_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-31T11:30:00.000Z"
 *       400:
 *         description: Yêu cầu không hợp lệ — gói dịch vụ không tồn tại hoặc đã bị xóa trước đó
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "PACKAGE_NOT_FOUND"
 *       500:
 *         description: Lỗi máy chủ nội bộ trong quá trình xóa gói dịch vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "DELETE_PACKAGE_FAIL"
 */

const deletePackage = async (req, res) => {
    try {

        const {
            id
        } = req.params;

        const packages = await packageService.getPackage(id);

        if (!packages) {
            return res.status(400).json({
                error: ERROR_MESSAGE.PACKAGE_NOT_FOUND
            });
        }

        if (await packageService.is_deleted(id)) {
            return res.status(400).json({
                error: ERROR_MESSAGE.PACKAGE_NOT_FOUND
            });
        }

        res.status(200).json({
            message: SUCCESS_MESSAGE.DELETE_PACKAGE_SUCCESS,
            package: await packageService.deletePackage(id),
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.DELETE_PACKAGE_FAIL, error);
        res.status(500).json({
            error: error.message
        });
    }
}

export default deletePackage;