import { Op } from 'sequelize';
import models from '../../models/index.js';
import { TRANSACTION_TYPE } from '../../config/constants.js';
const { transactions } = models;

const createTransaction = async (data, options = {}) => {
    return await transactions.create(data, options);
};

const getTransactionById = async (id, options = {}) => {
    return await transactions.findByPk(id, options);
};

const updateTransaction = async (id, data, options = {}) => {
    return await transactions.update(data, { where: { id }, ...options });
};

const deleteTransaction = async (id, options = {}) => {
    return await transactions.destroy({ where: { id }, ...options });
};

const getByUser = async (userId, { page, limit }) => {
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || null;
    const offset = (pageNum - 1) * pageSize;

    const data = await transactions.findAll({
        where: {
            [Op.or]: [
                { sender_id: userId },
                {
                    [Op.and]: [
                        { receiver_id: userId },
                        {
                            transaction_type: {
                                [Op.in]: [
                                    TRANSACTION_TYPE.REFUND,
                                    TRANSACTION_TYPE.RELEASE,
                                    TRANSACTION_TYPE.CASH_OUT,
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        ...(pageSize ? { limit: pageSize, offset } : {}),
        order: [['create_at', 'DESC']],
    });
    const total = await transactions.count({
        where: {
            [Op.or]: [
                { sender_id: userId },
                {
                    [Op.and]: [
                        { receiver_id: userId },
                        {
                            transaction_type: {
                                [Op.in]: [
                                    TRANSACTION_TYPE.REFUND,
                                    TRANSACTION_TYPE.RELEASE,
                                    TRANSACTION_TYPE.CASH_OUT,
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    });
    const pagination = pageSize ? { page: pageNum, limit: pageSize, total } : null;
    return { transactions: data, pagination };
};

export default {
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getByUser,
};
