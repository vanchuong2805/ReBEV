import jwtService from "../../services/auth/jwtService.js";
import userService from "../../services/user/userService.js";
import jwt from 'jsonwebtoken';

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided.' });
    }

    try {
        const decode = jwt.decode(refreshToken);

        await jwtService.verifyRefreshToken(decode.userId, refreshToken);

        const user = await userService.getUser(decode.userId);
        const payload = {
            id: user.id,
            display_name: user.display_name,
            role: user.role,
            avatar: user.avatar,
            package_id: user.package_id,
            package_start: user.package_start,
        }

        const newAccessToken = jwtService.createAccessToken(payload);
        res.status(200).json({ accessToken: newAccessToken });


    } catch (error) {
        console.error('Error during token refresh:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }

}
export default refreshToken;