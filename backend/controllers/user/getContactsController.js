import userContactService from "../../services/user/userContactService.js";

const getContacts = async (req, res) => {
    try {
        const option = req.query;

        const contacts = await userContactService.getUserContacts(option);
        res.status(200).json(contacts);

    } catch (error) {
        console.error("Failed to get contacts:", error);
        res.status(500).json({ error: "Failed to get contacts" });
    }
};

export default getContacts;