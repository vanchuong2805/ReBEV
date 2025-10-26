
const logout = (req, res) => {
    try {



    } catch (error) {
        console.error("Error occurred during logout:", error);
        res.status(400).json({
            message: "Bad request"
        });
    }
}

export default logout;

