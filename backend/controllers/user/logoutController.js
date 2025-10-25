import jwtService from "../../services/auth/jwtService.js";


const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await jwtService.logout(req.user.id, token);

        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.error("Error occurred during logout:", error);
        res.status(400).json({
            message: "Bad request"
        });
    }
}

export default logout;

