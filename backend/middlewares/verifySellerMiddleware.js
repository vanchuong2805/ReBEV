import userService from '../services/user/userService.js';

const verifySeller = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userService.getUser(id);
        const package_id = user?.package_id;
        if (package_id) {
            next();
        } else {
            res.status(403).json({ error: 'Please register as a seller to access this resource.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default verifySeller;
