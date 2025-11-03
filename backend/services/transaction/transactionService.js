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

const getByUser = async (userId) => {
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
    });
    return data;
};

export default {
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getByUser,
};
