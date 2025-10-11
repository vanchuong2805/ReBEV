import models from "../../models/index.js";
const { categories } = models;
const getAll = async () => {
    const data = await categories.findAll();
    return data;
};

const getById = async (id) => {
    const data = await categories.findByPk(id);
    return data;
};

export default {
    getAll,
    getById,
};
