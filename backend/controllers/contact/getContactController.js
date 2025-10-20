import userContactService from "../../services/user/userContactService.js";

const getContact = async (req, res) => {
    try {
        const contact = await userContactService.getUserContact(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.status(200).json(contact);

    } catch (error) {
        console.error("Failed to get contact:", error);
        res.status(500).json({ error: "Failed to get contact" });
    }
};

export default getContact;