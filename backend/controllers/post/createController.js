import postService from '../../services/post/postService.js';
import categoryService from '../../services/post/categoryService.js';
import { sequelize } from '../../models/index.js';
import postDetailService from '../../services/post/postDetailService.js';

/**
 * @swagger
 * /posts:
 *  post:
 *    summary: Tạo bài đăng mới
 *    tags: [Posts]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              price:
 *                type: number
 *              category_id:
 *                type: integer
 *              base_id:
 *                type: integer
 *              seller_contact_id:
 *                type: integer
 *              mediaFiles:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/MediaFile'
 *              details:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    variation_id:
 *                      type: integer
 *                    variation_value_id:
 *                      type: integer
 *                    custom_value:
 *                      type: string
 *    responses:
 *      201:
 *        description: Bài đăng được tạo thành công
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                post:
 *                  $ref: '#/components/schemas/Post'
 *      400:
 *        description: Thông tin không hợp lệ
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Missing required fields"
 *      401:
 *        description: Người dùng không được xác thực
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Unauthorized"
 *      404:
 *        description: Danh mục không tồn tại
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Category not found"
 *      500:
 *        description: Lỗi server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Server error"
 */

const createPost = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            category_id,
            title,
            description,
            price,
            base_id,
            seller_contact_id,
            mediaFiles,
            details,
        } = req.body;
        const user_id = req.user.id;
        if (
            !category_id ||
            !title ||
            price === undefined ||
            !description ||
            (!base_id && !seller_contact_id) ||
            !mediaFiles ||
            mediaFiles.length === 0 ||
            !details ||
            details.length === 0
        ) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        const category = await categoryService.getById(category_id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (category.is_deposit && !base_id) {
            return res.status(400).json({ message: 'Base ID is required for deposit categories' });
        }
        if (!category.is_deposit && !seller_contact_id) {
            return res
                .status(400)
                .json({ message: 'Seller contact ID is required for non-deposit categories' });
        }

        const media = JSON.stringify(mediaFiles);

        const newPost = await postService.createPost(
            {
                user_id,
                category_id,
                title,
                description,
                price,
                base_id,
                seller_contact_id,
                media,
            },
            { transaction: t }
        );

        const data = details.map((detail) => ({
            ...detail,
            post_id: newPost.id,
            custom_value: `${detail.custom_value}`,
        }));
        await postDetailService.createPostDetails(data, { transaction: t });

        await t.commit();
        res.status(201).json({ post: newPost });
    } catch (error) {
        if (t) {
            await t.rollback();
        }
        res.status(500).json({
            message: 'Failed to create post',
            error: error.message || 'Internal Server Error',
        });
    }
};

export default createPost;
