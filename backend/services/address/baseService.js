import models from '../../models/index.js';
const { bases } = models;

const getAll = async () => {
    const data = await bases.findAll();
    return data;
};

const getById = async (id) => {
    const data = await bases.findByPk(id);
    return data;
};

export default {
    getAll,
    getById,
};
