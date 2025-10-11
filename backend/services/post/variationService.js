import models from "../../models/index.js";
const { variations } = models;
const getAll = async () => {
    const data = await variations.findAll();
    return data;
};

const getByCategoryId = async (categoryId) => {
    const data = await variations.findAll({
        where: { category_id: categoryId }
    });
    return data;
};

export default {
    getAll,
    getByCategoryId,
};
