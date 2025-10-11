import models from "../../models/index.js";
const { variation_values } = models;
const getAll = async () => {
    const data = await variation_values.findAll();
    return data;
};

const getByVariationId = async (variationId) => {
    const data = await variation_values.findAll({
        where: { variation_id: variationId }
    });
    return data;
};

const getByParentId = async (parentId) => {
    const data = await variation_values.findAll({
        where: { parent_id: parentId }
    });
    return data;
}

export default {
    getAll,
    getByVariationId,
    getByParentId,
};
