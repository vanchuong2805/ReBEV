import { variations, variationValues } from '../../repositories/variationRepo.js';

const getVariations = async () => {
    const data = await variations.findAll();
    return data;
};
const getVariation = async (id) => {
    const data = await variations.findByPk(id);
    return data;
};
const getByCategory = async (categoryID) => {
    const data = await variations.findAll({
        where: {
            category_id: categoryID,
        },
    });
    return data;
};
const getVariationValues = async () => {
    const data = await variationValues.findAll();
    return data;
};
const getVariationValue = async (id) => {
    const data = await variationValues.findByPk(id);
    return data;
};
const getChildrenValues = async (id) => {
    const data = await variationValues.findAll({
        where: {
            parent_id: id,
        },
    });
    return data;
};
const getValuesByVariationID = async (variationID) => {
    const data = await variationValues.findAll({
        where: {
            variation_id: variationID,
        },
    });
    return data;
};

export default {
    getVariations,
    getVariationValues,
    getVariation,
    getVariationValue,
    getValuesByVariationID,
    getChildrenValues,
    getByCategory,
};
