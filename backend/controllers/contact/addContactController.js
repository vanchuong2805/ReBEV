import userContactService from "../../services/user/userContactService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/contacts/add:
 *   post:
 *     summary: Thêm một contact mới cho user
 *     description: API cho phép thêm địa chỉ liên lạc mới cho người dùng.
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - detail
 *               - ward_code
 *               - ward_name
 *               - district_id
 *               - district_name
 *               - province_id
 *               - province_name
 *               - name
 *               - phone
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID của người dùng
 *                 example: 10
 *               detail:
 *                 type: string
 *                 description: Địa chỉ chi tiết
 *                 example: "123 Lê Lợi, P. Bến Nghé"
 *               ward_code:
 *                 type: string
 *                 description: Mã phường/xã
 *                 example: "001"
 *               ward_name:
 *                 type: string
 *                 description: Tên phường/xã
 *                 example: "Bến Nghé"
 *               district_id:
 *                 type: integer
 *                 description: Mã quận/huyện
 *                 example: 1
 *               district_name:
 *                 type: string
 *                 description: Tên quận/huyện
 *                 example: "Quận 1"
 *               province_id:
 *                 type: integer
 *                 description: Mã tỉnh/thành phố
 *                 example: 79
 *               province_name:
 *                 type: string
 *                 description: Tên tỉnh/thành phố
 *                 example: "TP. Hồ Chí Minh"
 *               name:
 *                 type: string
 *                 description: Tên người nhận
 *                 example: "Nguyễn Văn A"
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *                 example: "0909123456"
 *               is_default:
 *                 type: boolean
 *                 description: Có phải địa chỉ mặc định hay không
 *                 example: false
 *     responses:
 *       200:
 *         description: Thêm contact thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact added successfully"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 10
 *                     detail:
 *                       type: string
 *                       example: "123 Lê Lợi, P. Bến Nghé"
 *                     ward_code:
 *                       type: string
 *                       example: "001"
 *                     ward_name:
 *                       type: string
 *                       example: "Bến Nghé"
 *                     district_id:
 *                       type: integer
 *                       example: 1
 *                     district_name:
 *                       type: string
 *                       example: "Quận 1"
 *                     province_id:
 *                       type: integer
 *                       example: 79
 *                     province_name:
 *                       type: string
 *                       example: "TP. Hồ Chí Minh"
 *                     name:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     phone:
 *                       type: string
 *                       example: "0909123456"
 *                     is_default:
 *                       type: boolean
 *                       example: false
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *
 *       400:
 *         description: Dữ liệu yêu cầu không hợp lệ (thiếu thông tin hoặc sai định dạng)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["User not found", "Detail cannot be empty"]
 *
 *       404:
 *         description: Không tìm thấy user với user_id được cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Add contact failed"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
const addUserContactDetail = async (req, res) => {
    try {
        const {
            user_id,
            detail,
            ward_code,
            ward_name,
            district_id,
            district_name,
            province_id,
            province_name,
            name,
            phone } = req.body;

        const user = await userContactService.getUserContactsByUserId(user_id);

        const errors = [];

        if (!user) {
            errors.push(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        if (!detail) {
            errors.push(ERROR_MESSAGE.CONTACT_DETAIL_BLANK);
        }
        if (!name) {
            errors.push(ERROR_MESSAGE.CONTACT_NAME_BLANK);
        }
        if (!phone) {
            errors.push(ERROR_MESSAGE.CONTACT_PHONE_BLANK);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                errors: errors
            });
        }

        const newContactDetail = await userContactService.createUserContact({
            user_id,
            detail,
            ward_code,
            ward_name,
            district_id,
            district_name,
            province_id,
            province_name,
            name,
            phone
        });

        res.status(200).json({
            message: SUCCESS_MESSAGE.ADD_CONTACT_DETAIL_SUCCESS,
            contact: newContactDetail,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.ADD_CONTACT_DETAIL_FAIL, error);
        res.status(400).json({
            error: error.message
        })
    }
}
export default addUserContactDetail;