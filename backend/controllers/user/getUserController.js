import userService from "../../services/user/userService.js";

const getUser = async (req, res) => {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Failed to get user:", error);
        res.status(500).json({ error: "Failed to get user" });
    }
};

export default getUser;