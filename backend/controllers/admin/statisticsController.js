import getStatistics from "../../services/admin/getStatisticsService.js";

const getStatistic = async (req, res) => {
    try {

        const { year } = req.query;

        const statistics = await getStatistics(year);

        return res.status(200).json({
            message: "Get statistics successfully",
            ...statistics
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default getStatistic;