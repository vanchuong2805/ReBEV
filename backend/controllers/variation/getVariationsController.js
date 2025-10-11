import variationService from "../../services/post/variationService.js";

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