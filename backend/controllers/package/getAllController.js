import packageService from "../../services/package/packageService.js";

const getAll = async (req, res) => {
    try {
        const packages = await packageService.getPackages();
        res.status(200).json(packages);

    } catch (error) {
        console.error("Failed to get packages:", error);
        res.status(500).json({ error: "Failed to get packages" });
    }
}

export default getAll;
