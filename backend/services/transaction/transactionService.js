import models from "../../models/index.js";
const { transactions } = models;

const createTransaction = async (data, options) => {
    return transactions.create(data, options);
};

const getTransactionById = async (id, options) => {
    return transactions.findByPk(id, options);
};

const updateTransaction = async (id, data, options) => {
    return transactions.update(data, { where: { id }, ...options });
};

const deleteTransaction = async (id, options) => {
    return transactions.destroy({ where: { id }, ...options });
};

export default {
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};
