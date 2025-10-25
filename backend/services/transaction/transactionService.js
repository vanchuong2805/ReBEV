import models from "../../models/index.js";
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

export default {
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};
