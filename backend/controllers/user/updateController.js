import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const userId = req.user.id;

        if (parseInt(id) !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const {
            display_name,
            password,
            avatar
        } = req.body;
        const error = [];

        const user = await userService.getUser(id);

        if (!user) {
            return error.push(ERROR_MESSAGE.USER_NOT_FOUND);
        }

        const data = {};

        if (display_name) {
            data.display_name = display_name;
        }

        if (password) {
            data.password = password;
        }



        const newUser = await userService.updateUser(id, {
            avatar,
            ...data,
            update_at: new Date()
        });
        res.status(200).json({
            message: SUCCESS_MESSAGE.UPDATE_USER_SUCCESS,
            user: newUser,
        });

        if (error.length > 0) {
            return res.status(400).json({ errors: error });
        }


    } catch (error) {
        console.error(ERROR_MESSAGE.UPDATE_USER_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}

export default updateUser;