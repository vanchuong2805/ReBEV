import { getAll } from "../../services/user/userService.js";

const getAllUsers = async (req, res) => {
    try {
        console.log("Fetching all users...");
        const users = await getAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Failed to get users:", error);
        res.status(500).json({ error: "Failed to get users" });
    }
};

export default getAllUsers;
