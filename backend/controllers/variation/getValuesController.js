import variationValueService from "../../services/post/variationValueService.js";

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

