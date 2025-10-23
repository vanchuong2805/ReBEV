import categoryService from '../../services/post/categoryService.js';

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách các danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách các danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default getAllCategories;
