import postService from '../../services/post/postService.js';
import categoryService from '../../services/post/categoryService.js';
import { sequelize } from '../../models/index.js';
import postDetailService from '../../services/post/postDetailService.js';
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

        const data = details.map(detail => ({ ...detail, post_id: newPost.id }));
        
        await postDetailService.createPostDetails(data, { transaction: t });

        await t.commit();
        res.status(201).json({post: newPost, details: data });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: 'Failed to create post',
            error: error.message || 'Internal Server Error',
        });
    }
};

export default createPost;
