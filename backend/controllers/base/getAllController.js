import baseService from '../../services/address/baseService.js';

const getAllBases = async (req, res) => {
    try {
        const bases = await baseService.getAll();
        res.status(200).json(bases);

    } catch (error) {
        console.error("Failed to get bases:", error);
        res.status(500).json({ error: "Failed to get bases" });
    }
};

export default getAllBases;