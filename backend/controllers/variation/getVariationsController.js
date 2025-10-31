import variationService from "../../services/post/variationService.js";

/** 
 * @swagger
 * /api/variations:
 *   get:
 *     summary: Get variations
 *     description: Retrieve variations based on query parameters
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: false
 *         description: The ID of the category to filter by
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Variations retrieved successfully
 *       404:
 *         description: Variations not found
 *       500:
 *         description: Internal server error
 */

const getVariations = async (req, res) => {
    try {
        const { categoryId } = req.query;
        const variations = categoryId
            ? await variationService.getByCategoryId(categoryId)
            : await variationService.getAll();
        res.status(200).json(variations);
    } catch (error) {
        console.error("Error fetching variations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export default getVariations;