import sequelize from '../../config/db.js';
import postService from '../../services/post/postService.js';
import { POST_STATUS } from '../../config/constants.js';
import postStatusService from '../../services/post/postStatusService.js';
import postMediaService from '../../services/post/postMediaService.js';
import postDetailService from '../../services/post/postDetailService.js';
const createController = async (req, res) => {
    const trans = await sequelize.transaction();
    try {
        const {
            user_id,
            category_id,
            title,
            description,
            price,
            base_id,
            seller_contact_id,
            media,
            details,
        } = req.body;
        if (
            !user_id ||
            !category_id ||
            !title ||
            !description ||
            !price ||
            (!base_id && !seller_contact_id) ||
            media.length === 0 ||
            details.length === 0
        ) {
            return res.status(400).send('Missing required fields');
        }

        const { dataValues: newPost } = await postService.create(
            { user_id, category_id, title, description, price, base_id, seller_contact_id },
            trans
        );
        await postStatusService.create({ post_id: newPost.id, status: POST_STATUS.PENDING }, trans);

        for (const item of media) {
            item.post_id = newPost.id;
            await postMediaService.create(item, trans);
        }

        for (const item of details) {
            item.post_id = newPost.id;
            await postDetailService.create(item, trans);
        }
        await trans.commit();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        await trans.rollback();
        res.status(500).send('Internal Server Error');
    }
};

export default createController;
