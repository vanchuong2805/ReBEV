import favoritePostService from "../../services/favorite/favoritePostService.js";

const getAllFavorites = async (req, res) => {
    try {
        const favorites = await favoritePostService.getAll();
        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error fetching favorite posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getAllFavorites;