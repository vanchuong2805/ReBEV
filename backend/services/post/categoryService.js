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

const updateRate = async (id, rate) => {
    const category = await categories.findByPk(id);

    if (!category) throw new Error('Category not found');

    if (category.is_deposit) {
        category.deposit_rate = rate;
    } else {
        category.commission_rate = rate;
    }
    await category.save();
    return category;
}


export default {
    getAll,
    getById,
    updateRate
};
