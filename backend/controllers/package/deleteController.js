import packageService from "../../services/package/packageService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/packages/{id}/delete:
 *   patch:
 *     summary: Delete a package
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the package to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */

const deletePackage = async (req, res) => {
    try {

        const {
            id
        } = req.params;

        const packages = await packageService.getPackage(id);

        if (!packages) {
            return res.status(400).json({ error: ERROR_MESSAGE.PACKAGE_NOT_FOUND });
        }

        if (await packageService.is_deleted(id)) {
            return res.status(400).json({ error: ERROR_MESSAGE.PACKAGE_NOT_FOUND });
        }

        res.status(200).json({
            message: SUCCESS_MESSAGE.DELETE_PACKAGE_SUCCESS,
            package: await packageService.deletePackage(id),
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.DELETE_PACKAGE_FAIL, error);
        res.status(500).json({
            error: error.message
        });
    }
}

export default deletePackage;