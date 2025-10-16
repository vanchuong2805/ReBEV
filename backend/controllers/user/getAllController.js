import userService from "../../services/user/userService.js";

const getAll = async (req, res) => {
    try {
        const option = req.query;

        const users = await userService.getUsers(option);
        res.status(200).json(users);

    } catch (error) {
        console.error("Failed to get users:", error);
        res.status(500).json({ error: "Failed to get users" });
    }
};

export default getAll;