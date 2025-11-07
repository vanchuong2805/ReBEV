import models from '../../models/index.js';
import Sequelize from 'sequelize';
const { users, posts, transactions, packages, order_detail, orders } = models;
import { Op } from 'sequelize';
import { ORDER_TYPE, TRANSACTION_TYPE } from '../../config/constants.js';

const getStatistics = async (year) => {

    //If no year is passed, defaults to current
    const targetYear = year || new Date().getFullYear();

    const startDate = `${targetYear}-01-01 00:00:00`;
    const endDate = `${targetYear}-12-31 23:59:59`;

    const totalUsers = await users.count();

    const totalPosts = await posts.count();

    const totalTransactions = await transactions.count();

    const transactionsByYear = await transactions.findAll({
        where: Sequelize.literal(`[transactions].[create_at] BETWEEN '${startDate}' AND '${endDate}'`),
        include: [

            {
                association: 'related_order_detail',
                attributes: []
            },

        ],
        attributes: [
            // Lấy tháng từ cột create_at
            [Sequelize.literal('MONTH([transactions].[create_at])'), 'month'],
            // Đếm số lượng giao dịch
            [Sequelize.fn('COUNT', Sequelize.col('transactions.id')), 'transaction_count']
        ],
        group: [Sequelize.literal('MONTH([transactions].[create_at])')],

    });

    const revenueByYear = await transactions.findAll({
        where: {
            [Op.and]: [Sequelize.literal(`[transactions].[create_at] BETWEEN '${startDate}' AND '${endDate}'`),
            Sequelize.literal(`[transactions].[transaction_type] in (${TRANSACTION_TYPE.PACKAGE_FEE}, ${TRANSACTION_TYPE.RELEASE})`)

            ]
        },

        include: [

            {
                association: 'related_order_detail',
                attributes: []
            },

        ],
        attributes: [
            // Lấy tháng từ cột create_at
            [Sequelize.literal('MONTH([transactions].[create_at])'), 'month'],
            // Lấy loại giao dịch
            [Sequelize.literal('[transactions].[transaction_type]'), 'transaction_type'],
            // Tổng tiền giao dịch
            [Sequelize.fn('SUM', Sequelize.col('transactions.amount')), 'transaction_sum'],
            // Tổng tiền hoa hồng
            [Sequelize.literal(`
                ISNULL(
                SUM(
                    CASE 
                    WHEN [transactions].[transaction_type] = ${TRANSACTION_TYPE.RELEASE} 
                    THEN [related_order_detail].[commission_amount]
                    ELSE 0
                    END
                ), 
                0)
            `),
                'commission_sum']
        ],
        group: [Sequelize.literal('MONTH([transactions].[create_at]), [transactions].[transaction_type]')],

    });
    const revenue = await transactions.findAll({
        where: {
            [Op.and]: [
                Sequelize.literal(`[transactions].[transaction_type] IN (${TRANSACTION_TYPE.PACKAGE_FEE}, ${TRANSACTION_TYPE.RELEASE})`),
                {
                    status: 0
                }
            ]
        },

        include: [
            {
                association: 'related_order_detail',
                attributes: []
            },

        ],
        attributes: [
            // Lấy loại giao dịch
            [Sequelize.literal('[transactions].[transaction_type]'), 'transaction_type'],
            // Tổng tiền giao dịch
            [Sequelize.fn('SUM', Sequelize.col('transactions.amount')), 'transaction_sum'],
            // Tổng tiền hoa hồng
            [Sequelize.literal(`
                ISNULL(
                SUM(
                    CASE 
                    WHEN [transactions].[transaction_type] = ${TRANSACTION_TYPE.RELEASE} 
                    THEN [related_order_detail].[commission_amount]
                    ELSE 0
                    END
                ), 
                0)
            `),
                'commission_sum']
        ],
        group: [Sequelize.literal('[transactions].[transaction_type]')],

    });
    const monthlyRevenues = Array(13).fill().map(() => []);
    const monthlyTransactions = Array(13).fill(0);
    transactionsByYear.forEach(record => {
        monthlyTransactions[record.get('month')] = record.get('transaction_count');
    });

    revenueByYear.forEach(record => {
        const month = record.get('month');
        monthlyRevenues[month].push({
            transaction_type: record.get('transaction_type'),
            transaction_sum: record.get('transaction_sum'),
            commission_sum: record.get('commission_sum')
        });
    });



    return {
        totalUsers,
        totalPosts,
        totalTransactions,
        monthlyRevenues,
        monthlyTransactions,
        revenue
    };
}

export default getStatistics;