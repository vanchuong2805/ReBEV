import variationValueService from "../../services/post/variationValueService.js";

/** 
 * @swagger
 * /api/variations/values:
 *   get:
 *     summary: Get variation values
 *     description: Retrieve variation values based on query parameters
 *     parameters:
 *       - in: query
 *         name: variationId
 *         required: false
 *         description: The ID of the variation to filter by
 *         schema:
 *           type: integer
 *       - in: query
 *         name: parentId
 *         required: false
 *         description: The ID of the parent variation to filter by
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Variation values retrieved successfully
 *       404:
 *         description: Variation not found
 *       500:
 *         description: Internal server error
 */

const getVariationValues = async (req, res) => {
    try {
        const { variationId, parentId } = req.query;
        let variationValues = [];
        if (parentId) {
            variationValues = await variationValueService.getByParentId(parentId);
        } else if (variationId) {
            variationValues = await variationValueService.getByVariationId(variationId);
        } else {
            variationValues = await variationValueService.getAll();
        }
        res.status(200).json(variationValues);
    } catch (error) {
        console.error("Error fetching variation values:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export default getVariationValues;

