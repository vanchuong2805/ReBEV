import models, { sequelize } from '../../models/index.js';
import { POST_STATUS } from '../../config/constants.js';
import { fn, literal, Op } from 'sequelize';
const { users } = models;
const { posts } = models;

const getUserStatistics = async (user_id, year = null) => {
    const targetYear = year || new Date().getFullYear();

    const startDate = `${targetYear}-01-01 00:00:00`;
    const endDate = `${targetYear}-12-31 23:59:59`;

    const user = await users.findByPk(user_id);
    if (!user) throw new Error('User not found');


    const totalPosts = await posts.count({
        where: {
            user_id: user_id,
            is_deleted: false
        },
    });

    const sellingPosts = await posts.count({
        where: {
            user_id: user_id,
            is_deleted: false,
            is_hidden: false,
            status: POST_STATUS.APPROVED,

        },
    });

    const soldPosts = await posts.count({
        where: {
            user_id: user_id,
            is_deleted: false,
            status: POST_STATUS.SOLD,
        }
    })

    const tradingPosts = await posts.count({
        where: {
            user_id: user_id,
            is_deleted: false,
            status: POST_STATUS.RESERVED,
        }
    })

    const totalRevenue = await posts.sum('price', {
        where: {
            user_id: user_id,
            is_deleted: false,
            status: POST_STATUS.SOLD,
        }
    })

    //Biểu đồ doanh thu theo từng năm

    const revenueByMonthly = await posts.findAll({
        where: {
            user_id: user_id,
            is_deleted: false,
            status: POST_STATUS.SOLD,
            [Op.and]: [
                literal(`posts.create_at BETWEEN '${startDate}' AND '${endDate}'`)
            ]
        },
        attributes: [
            [fn('MONTH', sequelize.col('create_at')), 'month'],
            [fn('SUM', sequelize.col('price')), 'revenue']
        ],
        group: [literal("MONTH(create_at)")],
        order: literal("MONTH(create_at) ASC"),
        raw: true
    });

    const monthlyRevenue = Array(13).fill(0);
    revenueByMonthly.forEach(record => {
        const month = record.month;
        const revenue = parseFloat(record.revenue);
        monthlyRevenue[month] = revenue;
    });


    return {
        totalPosts,
        sellingPosts,
        soldPosts,
        tradingPosts,
        totalRevenue,
        monthlyRevenue,
    };
}

export default getUserStatistics;