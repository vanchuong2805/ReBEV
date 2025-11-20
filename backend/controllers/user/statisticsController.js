import getUserStatistics from '../../services/user/getStatisticsService.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import { ERROR_MESSAGE } from '../../config/constants.js';

/**
 * @swagger
 * /api/users/{user_id}/statistics:
 *   get:
 *     summary: Get user statistics
 *     description: |
 *       Retrieve detailed statistics for a specific user, including:  
 *       - Total posts  
 *       - Posts currently selling  
 *       - Posts sold  
 *       - Posts in trading/reserved status  
 *       - Total revenue  
 *       - Monthly revenue chart for a specific year  
 * 
 *       If the **year** query parameter is not provided, the API defaults to the **current year**.
 *     tags: [Users]
 *     operationId: getUserStatistics
 * 
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user to retrieve statistics for
 *         schema:
 *           type: integer
 *           example: 12
 *
 *       - in: query
 *         name: year
 *         required: false
 *         description: Year to calculate statistics (defaults to current year)
 *         schema:
 *           type: integer
 *           example: 2025
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved user statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatisticsResponse'
 *             examples:
 *               default:
 *                 summary: Example response
 *                 value:
 *                   message: "User statistics retrieved successfully"
 *                   data:
 *                     totalPosts: 20
 *                     sellingPosts: 8
 *                     soldPosts: 6
 *                     tradingPosts: 2
 *                     totalRevenue: 15500000
 *                     monthlyRevenue: [0, 2000000, 1500000, 0, 3000000, 0, 0, 0, 2500000, 0, 0, 4500000, 0]
 *
 *       400:
 *         description: Invalid year or parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               invalidYear:
 *                 summary: Invalid year provided
 *                 value:
 *                   message: "Invalid query parameters"
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               userNotFound:
 *                 summary: User does not exist
 *                 value:
 *                   message: "User not found"
 *
 *       500:
 *         description: Failed to retrieve user statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *             examples:
 *               dbFail:
 *                 summary: Database error
 *                 value:
 *                   message: "Failed to get user statistics"
 *                   error: "Database connection lost"
*/

const getStatistics = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { year } = req.query;
        const statitics = await getUserStatistics(user_id, year);

        return res.status(200).json({
            message: SUCCESS_MESSAGE.USER_STATISTICS_RETRIEVED,
            data: statitics
        });

    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.GET_USER_STATISTICS_FAILED,
            error: error.message
        });
    }
}

export default getStatistics;