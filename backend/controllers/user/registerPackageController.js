import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";
import packageService from "../../services/package/packageService.js";

const registerPackage = async (req, res) => {
    try {
        const { user_id, package_id } = req.params;
        const errors = [];
        const user = await userService.getUser(user_id);
        const packages = await packageService.getPackage(package_id);

        if (!user) {
            errors.push(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        if (!packages) {
            errors.push(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
        }
        if (errors.length > 0) {
            return res.status(404).json({ errors });
        }
        const updatedPackages = await userService.updatePackage(user_id, { package_id });
        res.status(200).json({
            message: SUCCESS_MESSAGE.REGISTER_SUCCESS,
            user: updatedPackages,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.REGISTER_FAIL, error);
        res.status(400).json({
            error: error.message,
        });
    }
}

export default registerPackage;