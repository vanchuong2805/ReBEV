import packageService from "../../services/package/packageService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/packages/{id}/update:
 *   put:
 *     summary: Update a package
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the package to update
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
 *         description: Package updated successfully
 *       400:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
const updatePackage = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const { 
            name, 
            price, 
            description, 
            highlight, 
            top, 
            duration } = req.body;

        const oldPackages = await packageService.getPackage(id);

        if (!oldPackages) {
            return res.status(400).json({ 
                error: ERROR_MESSAGE.PACKAGE_NOT_FOUND 
            });
        }

        if (await packageService.is_deleted(id)) {
            return res.status(400).json({ 
                error: ERROR_MESSAGE.PACKAGE_NOT_FOUND
             });
        } else {
            await packageService.deletePackage(id);
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
            message: SUCCESS_MESSAGE.UPDATE_PACKAGE_SUCCESS,
            oldPackageId: id,
            package: newPackage,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.UPDATE_PACKAGE_FAIL, error);
        res.status(500).json({
            error: error.message
        });
    }
}

export default updatePackage;