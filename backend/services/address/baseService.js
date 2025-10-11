import models from '../../models/index.js';
const { bases } = models;

const getAll = async () => {
    const data = await bases.findAll();
    return data;
};

export default {
    getAll,
};
