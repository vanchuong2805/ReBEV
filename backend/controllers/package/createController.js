import packageService from "../../services/package/packageService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/packages/create:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               highlight:
 *                 type: boolean
 *               top:
 *                 type: boolean
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Package created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */

const createPackage = async (req, res) => {

    try {
        const {
            name,
            price,
            description,
            highlight,
            top,
            duration
        } = req.body;

        if (!name || !price || !description || !duration) {
            return res.status(400).json({
                error: ERROR_MESSAGE.BLANK_INFORMATION
            });
        }

        const newPackage = await packageService.createPackage(
            name,
            description,
            price,
            highlight,
            top,
            duration
        );

        res.status(200).json({
            message: SUCCESS_MESSAGE.CREATE_PACKAGE_SUCCESS,
            package: newPackage,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.CREATE_PACKAGE_FAIL, error);
        res.status(500).json({
            error: error.message
        });
    }
};
export default createPackage;